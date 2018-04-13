package ca.bc.gov.jag.shuber.client;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.platform.runner.JUnitPlatform;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.hateoas.MediaTypes;
import org.springframework.hateoas.Resource;
import org.springframework.hateoas.hal.Jackson2HalModule;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import ca.bc.gov.jag.shuber.AbstractTest;
import ca.bc.gov.jag.shuber.persistence.model.Assignment;
import ca.bc.gov.jag.shuber.persistence.model.Courthouse;
import ca.bc.gov.jag.shuber.persistence.model.Courtroom;
import ca.bc.gov.jag.shuber.persistence.model.DutyRecurrence;
import ca.bc.gov.jag.shuber.persistence.model.JailRoleCode;
import ca.bc.gov.jag.shuber.persistence.model.OtherAssignCode;
import ca.bc.gov.jag.shuber.persistence.model.Region;
import ca.bc.gov.jag.shuber.persistence.model.WorkSectionCode;
import ca.bc.gov.jag.shuber.rest.dto.post.AssignmentResource;
import ca.bc.gov.jag.shuber.rest.dto.post.CourthouseResource;
import ca.bc.gov.jag.shuber.rest.dto.post.CourtroomResource;
import ca.bc.gov.jag.shuber.rest.dto.post.DutyRecurrenceResource;
import ca.bc.gov.jag.shuber.rest.dto.post.RegionResource;

/**
 * Base class for tests that will run against an end point. The database could be 
 * in memory (H2) or something else. You can also use MockMvc, RestTemplate or TestRestTemplate
 * for accessing the end points (repositories).
 * 
 * @see AbstractIntegrationTest
 * @see AbstractUnitTest
 * @author michael.gabelmann
 */
@RunWith(JUnitPlatform.class)
@ExtendWith(SpringExtension.class)
@SpringBootTest(
	webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT
)
@AutoConfigureMockMvc
public abstract class AbstractClientTest extends AbstractTest {
	@Autowired
	protected TestRestTemplate testRestTemplate;

	@Autowired 
	protected ObjectMapper mapper;
	
	@Autowired 
	protected MockMvc mvc;
	
	@LocalServerPort
	protected int port;
	
	/**
	 * Get REST template configured for HAL+JSON.
	 * @return rest template
	 */
	public final RestTemplate getRestTemplate() {
		ObjectMapper mapper = new ObjectMapper();
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        mapper.registerModules(new Jackson2HalModule(), new JavaTimeModule());

        MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
        converter.setSupportedMediaTypes(MediaType.parseMediaTypes(MediaTypes.HAL_JSON_VALUE));
        converter.setObjectMapper(mapper);

        List<HttpMessageConverter<?>> list = new ArrayList<HttpMessageConverter<?>>();
        list.add(converter);
        return new RestTemplate(list);
	}
	
	
	public final ResponseEntity<Resource<WorkSectionCode>> postResource(WorkSectionCode wsc) {
		ParameterizedTypeReference<Resource<WorkSectionCode>> wscRef = new ParameterizedTypeReference<Resource<WorkSectionCode>>() {};
		return testRestTemplate.exchange("/api/workSectionCodes", HttpMethod.POST, new HttpEntity<WorkSectionCode>(wsc), wscRef);
	}
	
	public final ResponseEntity<Resource<JailRoleCode>> postResource(JailRoleCode jrc) {
		ParameterizedTypeReference<Resource<JailRoleCode>> jrcRef = new ParameterizedTypeReference<Resource<JailRoleCode>>() {};
		return testRestTemplate.exchange("/api/jailRoleCodes", HttpMethod.POST, new HttpEntity<JailRoleCode>(jrc), jrcRef);
	}
	
	public final ResponseEntity<Resource<OtherAssignCode>> postResource(OtherAssignCode oac) {
		ParameterizedTypeReference<Resource<OtherAssignCode>> oacRef = new ParameterizedTypeReference<Resource<OtherAssignCode>>() {};
		return testRestTemplate.exchange("/api/otherAssignCodes", HttpMethod.POST, new HttpEntity<OtherAssignCode>(oac), oacRef);
	}
	
	public final ResponseEntity<Resource<Region>> postResource(RegionResource r) {
		ParameterizedTypeReference<Resource<Region>> rRef = new ParameterizedTypeReference<Resource<Region>>() {};
		return testRestTemplate.exchange("/api/regions", HttpMethod.POST, new HttpEntity<RegionResource>(r), rRef);
	}
	
	public final ResponseEntity<Resource<Courthouse>> postResource(CourthouseResource c) {
		ParameterizedTypeReference<Resource<Courthouse>> cRef = new ParameterizedTypeReference<Resource<Courthouse>>() {};
		return testRestTemplate.exchange("/api/courthouses", HttpMethod.POST, new HttpEntity<CourthouseResource>(c), cRef);
	}
	
	public final ResponseEntity<Resource<Courtroom>> postResource(CourtroomResource c) {
		ParameterizedTypeReference<Resource<Courtroom>> cRef = new ParameterizedTypeReference<Resource<Courtroom>>() {};
		return testRestTemplate.exchange("/api/courtrooms", HttpMethod.POST, new HttpEntity<CourtroomResource>(c), cRef);
	}
	
	public final ResponseEntity<Resource<Assignment>> postResource(AssignmentResource ar) {
		ParameterizedTypeReference<Resource<Assignment>> aRef = new ParameterizedTypeReference<Resource<Assignment>>() {};
		return testRestTemplate.exchange("/api/assignments", HttpMethod.POST, new HttpEntity<AssignmentResource>(ar), aRef);
	}
	
	public final ResponseEntity<Resource<DutyRecurrence>> postResource(DutyRecurrenceResource dr) {
		ParameterizedTypeReference<Resource<DutyRecurrence>> drRef = new ParameterizedTypeReference<Resource<DutyRecurrence>>() {};
		return testRestTemplate.exchange("/api/dutyRecurrences", HttpMethod.POST, new HttpEntity<DutyRecurrenceResource>(dr), drRef);
	}
	
}
