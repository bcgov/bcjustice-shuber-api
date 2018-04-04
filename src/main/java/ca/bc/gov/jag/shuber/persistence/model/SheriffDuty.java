package ca.bc.gov.jag.shuber.persistence.model;

import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.GenericGenerator;

import ca.bc.gov.jag.shuber.persistence.AbstractAuditableVersionable;

/**
 * SheriffDuty generated by Hibernate Tools hbm2java.
 *
 * <p>Domain model for database table sheriff_duty.
 *
 * @author hbm2java
 * @version 391
 */
@Entity
@Table(name = "sheriff_duty"
    // ,schema="shersched"
)
public class SheriffDuty extends AbstractAuditableVersionable implements Serializable {

    /** UID. */
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "sheriff_duty_id", nullable = false, updatable = false)
    private UUID sheriffDutyId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "duty_id", nullable = false)
    private Duty duty;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sheriff_id", nullable = false)
    private Sheriff sheriff;
    
    /** No args constructor. */
    public SheriffDuty() {}

    /** All args constructor. */
    public SheriffDuty(
            UUID sheriffDutyId,
            Duty duty,
            Sheriff sheriff,
            String createdBy,
            String updatedBy,
            Instant createdDtm,
            Instant updatedDtm,
            long revisionCount) {
        this.sheriffDutyId = sheriffDutyId;
        this.duty = duty;
        this.sheriff = sheriff;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDtm = createdDtm;
        this.updatedDtm = updatedDtm;
        this.revisionCount = revisionCount;
    }

    public UUID getSheriffDutyId() {
        return this.sheriffDutyId;
    }

    public void setSheriffDutyId(UUID sheriffDutyId) {
        this.sheriffDutyId = sheriffDutyId;
    }

    public Duty getDuty() {
        return this.duty;
    }

    public void setDuty(Duty duty) {
        this.duty = duty;
    }

    public Sheriff getSheriff() {
        return this.sheriff;
    }

    public void setSheriff(Sheriff sheriff) {
        this.sheriff = sheriff;
    }
    
    @Transient
	@Override
	public String getIdPath() {
		return "/sheriffDuties/" + sheriffDutyId;
	}
}
