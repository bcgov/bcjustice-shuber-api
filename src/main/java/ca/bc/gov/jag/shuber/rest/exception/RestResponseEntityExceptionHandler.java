package ca.bc.gov.jag.shuber.rest.exception;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.data.rest.core.RepositoryConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.TransactionSystemException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.Errors;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Make error messages more meaningful. To disable simply comment out the {@code @ControllerAdvice} 
 * annotation. This will return to Springs validation and event handling.
 * 
 * <pre>
 * Default Spring error message format:
 * {  
 *  "errors":[  
 *    {  
 *      "entity":"Sheriff",
 *      "property":"badgeNo",
 *      "invalidValue":"XX1234",
 *      "message":"A Sheriff with badge number XX1234 already exists"
 *    }]
 * }
 * 
 * More meaningful messages:
 * {  
 *  "datetime":"2018-03-02 01:14:12",
 *  "exception":"org.springframework.data.rest.core.RepositoryConstraintViolationException",
 *  "globalErrors":[  
 *    {  
 *      "objectName":"Sheriff",
 *      "code":"error.record.exists",
 *      "defaultMessage":"Record exists",
 *      "localizedMessage":"Duplicate record."
 *    }],
 *  "fieldErrors":[  
 *    {  
 *      "objectName":"Sheriff",
 *      "code":"error.record.exists.Sheriff.badgeNo",
 *      "defaultMessage":"Badge number already exists.",
 *      "localizedMessage":"A Sheriff with badge number XX1234 already exists",
 *      "field":"badgeNo",
 *      "rejectedValue":"XX1234"
 *    }]
 * }
 * </pre>
 * 
 * @see http://www.baeldung.com/spring-data-rest-validators
 */
@ControllerAdvice
public class RestResponseEntityExceptionHandler extends ResponseEntityExceptionHandler {
	/** Logger. */
	private static final Logger log = LogManager.getLogger(RestResponseEntityExceptionHandler.class);
	
	@Autowired
	private MessageSource messageSource;
	
	
	/**
	 * Handle errors  thrown by {@code Validator}.
	 * 
	 * @param e exception
	 * @param request web request
	 * @return response
	 * @see org.springframework.validation.Validator
	 */
	@ExceptionHandler(RepositoryConstraintViolationException.class)
	public ResponseEntity<Object> handleRepositoryConstraintViolationException(
		Exception e, 
		WebRequest request) {
		
		RepositoryConstraintViolationException rcve = (RepositoryConstraintViolationException) e;
		Errors errors = rcve.getErrors();

		if (log.isDebugEnabled()) {
			log.debug("Handling errors from Validator, message=" + e.getMessage());
		}
		
		RestErrors ve = this.getValidationErrors(errors.getGlobalErrors(), errors.getFieldErrors(), e);
		
		return new ResponseEntity<>(ve, new HttpHeaders(), HttpStatus.BAD_REQUEST);
	}
	
	/**
	 * If we didn't implement a validator for an Entity or the validator is 
	 * not validating the correct type (save/update/delete), then Hibernate/Spring 
	 * will throw these errors when it tries to persist the object.
	 * 
	 * <pre>
	 *	List of constraint violations:[
	 *	ConstraintViolationImpl{
	 *		interpolatedMessage='must not be empty', 
	 *		propertyPath=badgeNo, 
	 *		rootBeanClass=class ca.bc.gov.jag.shuber.persistence.model.Sheriff, 
	 *		messageTemplate='{javax.validation.constraints.NotEmpty.message}'
	 *	}
	 *	ConstraintViolationImpl{
	 *		interpolatedMessage='must not be empty', 
	 *		propertyPath=userid, 
	 *		rootBeanClass=class ca.bc.gov.jag.shuber.persistence.model.Sheriff, 
	 *		messageTemplate='{javax.validation.constraints.NotEmpty.message}'
	 *	}
	 * </pre>
	 * 
	 * @param e exception
	 * @param request web request
	 * @return response
	 */
	@ExceptionHandler(TransactionSystemException.class)
	public ResponseEntity<Object> handleTransactionSystemException(
		Exception e, 
		WebRequest request) {
		
		TransactionSystemException tse = (TransactionSystemException) e;
		Throwable rc = tse.getRootCause();	
		RestErrors ve = null;
		
		if (log.isDebugEnabled()) {
			log.debug("Handling errors from Validation annotations checked by Hibernate, message=" + e.getMessage());
		}

		if (rc instanceof ConstraintViolationException) {
			ConstraintViolationException cve = (ConstraintViolationException) rc;
			Set<ConstraintViolation<?>> violations = cve.getConstraintViolations();
			List<FieldError> fieldErrors = new ArrayList<>();
			
			for (ConstraintViolation<?> violation : violations) {
				String objectName = violation.getRootBean().getClass().getName();
				String field = violation.getPropertyPath().toString();
				Object rejectedValue = violation.getInvalidValue();
				boolean bindingFailure = false;
				String[] codes = new String[] {"error.validation.constraint"};
				Object[] arguments = null;
				String defaultMessage = violation.getMessage();
				
				fieldErrors.add(new FieldError(objectName, field, rejectedValue, bindingFailure, codes, arguments, defaultMessage));
			}
			
			ve = this.getValidationErrors(null, fieldErrors, e);
			
		} else {
			ve = this.getValidationErrors(null, null, tse);
		}
		
		return new ResponseEntity<>(ve, new HttpHeaders(), HttpStatus.BAD_REQUEST);
	}
	
	@Override
	protected ResponseEntity<Object> handleMethodArgumentNotValid(
		MethodArgumentNotValidException ex,
		HttpHeaders headers, 
		HttpStatus status, 
		WebRequest request) {
		
		BindingResult bindingResult = ex.getBindingResult();
		
		if (log.isDebugEnabled()) {
			log.debug("Handling errors from @Valid/@Validated, message=" + ex.getMessage());
		}
		
		RestErrors ve = this.getValidationErrors(bindingResult.getGlobalErrors(), bindingResult.getFieldErrors(), ex);
		
		return new ResponseEntity<>(ve, HttpStatus.UNPROCESSABLE_ENTITY);
	}
	
	/**
	 * Helper method that maps errors to our custom objects.
	 * 
	 * @param globalErrors global errors
	 * @param fieldErrors field errors
	 * @param e exception
	 * @return errors
	 */
	private RestErrors getValidationErrors(
		List<ObjectError> globalErrors, 
		List<FieldError> fieldErrors,
		Exception e) {
		
		if (fieldErrors == null) fieldErrors = new ArrayList<>();
		if (globalErrors == null) globalErrors = new ArrayList<>();
		
		if (log.isDebugEnabled()) {
			//log errors received
			globalErrors.stream().forEach(f -> log.debug("globalError=" + f.toString()));
			fieldErrors.stream().forEach(f -> log.debug("fieldError=" + f.toString() + ", code=" + f.getCode() + ", args=" + f.getArguments()));
			
		}
		
		/* Examples of what comes back from FieldError object:
		  fieldError=Field error in object 'Assignment' on field 'courtroom': rejected value [null]; 
		   codes [error.validation.workSectionCode.Assignment.courtroom,
		   		  error.validation.workSectionCode.courtroom,
		   		  error.validation.workSectionCode.ca.bc.gov.jag.shuber.persistence.model.Courtroom,
		   		  error.validation.workSectionCode]; 
		   defaultMessage=courtroom is required for COURTS, 
		   code=error.validation.workSectionCode
		   
		   fieldError=Field error in object 'Sheriff' on field 'badgeNo': rejected value []; 
		   	codes [NotEmpty.Sheriff.badgeNo,
		   		   NotEmpty.badgeNo,
		   		   NotEmpty.java.lang.String,
		   		   NotEmpty]; 
		   	default message [must not be empty], 
		   	code=NotEmpty
		 */
		
		List<RestGlobalError> ge = globalErrors
			.stream()
			.map(globalError -> new RestGlobalError(
				globalError.getObjectName(), 
				globalError.getCode(), 
				globalError.getDefaultMessage(), 
				messageSource.getMessage(globalError.getCode(), globalError.getArguments(), Locale.ENGLISH)))
			.collect(Collectors.toList());
		
		List<RestFieldError> fe = fieldErrors
			.stream()
			.map(fieldError -> new RestFieldError(
				fieldError.getObjectName(),
				fieldError.getCode(),
				fieldError.getDefaultMessage(),
				
				//Try and build a localized message using the first available code, if one cannot be found the defaultMessage is used
				messageSource.getMessage(
					(fieldError.getCodes() != null && fieldError.getCodes().length > 0 ? fieldError.getCodes()[0] : fieldError.getCode()), 
					fieldError.getArguments(), 
					fieldError.getDefaultMessage(), 
					Locale.getDefault()),
				
				fieldError.getField(),
				fieldError.getRejectedValue()))
			.collect(Collectors.toList());
		
		RestErrors re = new RestErrors(ge, fe);
		re.setException(e);
		
		return re;
	}
	
}
