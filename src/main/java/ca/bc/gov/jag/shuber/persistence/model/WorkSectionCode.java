package ca.bc.gov.jag.shuber.persistence.model;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.Size;

import ca.bc.gov.jag.shuber.persistence.AbstractTypeCode;

/**
 * WorkSectionCode generated by Hibernate Tools hbm2java.
 *
 * <p>Domain model for database table work_section_code.
 *
 * @author hbm2java
 * @version 391
 */
@Entity
@Table(name = "work_section_code"
    // ,schema="shersched"
)
public class WorkSectionCode extends AbstractTypeCode implements Serializable {
	public enum WORK_SECTION_CODE {
		COURTS,
		JAIL,
		ESCORTS,
		OTHER,
		;
	}
	
    /** UID. */
    private static final long serialVersionUID = 1L;

    @Id
    @Size(min = 1, max = 20)
    @Column(name = "work_section_code", nullable = false, updatable = false, length = 20)
    private String workSectionCode;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workSectionCode")
    private List<Assignment> assignments = new ArrayList<Assignment>(0);
    
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "workSectionCode")
    private List<Shift> shifts = new ArrayList<Shift>(0);

	/** No args constructor. */
    public WorkSectionCode() {}

    /** Required args constructor. */
    public WorkSectionCode(
            String workSectionCode,
            String description,
            LocalDate effectiveDate,
            String createdBy,
            String updatedBy,
            Instant createdDtm,
            Instant updatedDtm,
            long revisionCount) {
        this.workSectionCode = workSectionCode;
        this.description = description;
        this.effectiveDate = effectiveDate;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDtm = createdDtm;
        this.updatedDtm = updatedDtm;
        this.revisionCount = revisionCount;
    }

    /** All args constructor. */
    public WorkSectionCode(
            String workSectionCode,
            String description,
            LocalDate effectiveDate,
            LocalDate expiryDate,
            String createdBy,
            String updatedBy,
            Instant createdDtm,
            Instant updatedDtm,
            long revisionCount,
            List<Assignment> assignments) {
        this.workSectionCode = workSectionCode;
        this.description = description;
        this.effectiveDate = effectiveDate;
        this.expiryDate = expiryDate;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDtm = createdDtm;
        this.updatedDtm = updatedDtm;
        this.revisionCount = revisionCount;
        this.assignments = assignments;
    }

    public String getWorkSectionCode() {
        return this.workSectionCode;
    }

    public void setWorkSectionCode(String workSectionCode) {
        this.workSectionCode = workSectionCode;
    }

    public List<Assignment> getAssignments() {
        return this.assignments;
    }

    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }
    
    public List<Shift> getShifts() {
		return shifts;
	}

	public void setShifts(List<Shift> shifts) {
		this.shifts = shifts;
	}
    
    //Added Methods
    @Transient
	@Override
	public String getTypeCode() {
		return workSectionCode;
	} 
    
    @Transient
	@Override
	public String getIdPath() {
		return "/workSectionCodes/" + workSectionCode;
	}
}
