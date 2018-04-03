package ca.bc.gov.jag.shuber.persistence.model;

import ca.bc.gov.jag.shuber.persistence.AbstractAuditableVersionable;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import org.hibernate.annotations.GenericGenerator;

/**
 * Courtroom generated by Hibernate Tools hbm2java.
 *
 * <p>Domain model for database table courtroom.
 *
 * @author hbm2java
 * @version 391
 */
@Entity
@Table(name = "courtroom"
    // ,schema="shersched"
)
public class Courtroom extends AbstractAuditableVersionable implements Serializable {

    /** UID. */
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid2")
    @GenericGenerator(name = "uuid2", strategy = "uuid2")
    @Column(name = "courtroom_id", nullable = false, updatable = false)
    private UUID courtroomId;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "courthouse_id", nullable = false)
    private Courthouse courthouse;

    @NotEmpty
    @Size(min = 1, max = 32)
    @Column(name = "courtroom_cd", unique = true, nullable = false, length = 32)
    private String courtroomCd;

    @NotEmpty
    @Size(min = 1, max = 100)
    @Column(name = "courtroom_name", nullable = false, length = 100)
    private String courtroomName;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "courtroom")
    private List<Assignment> assignments = new ArrayList<Assignment>(0);
    /** No args constructor. */
    public Courtroom() {}

    /** Required args constructor. */
    public Courtroom(
            UUID courtroomId,
            Courthouse courthouse,
            String courtroomCd,
            String courtroomName,
            String createdBy,
            String updatedBy,
            Date createdDtm,
            Date updatedDtm,
            long revisionCount) {
        this.courtroomId = courtroomId;
        this.courthouse = courthouse;
        this.courtroomCd = courtroomCd;
        this.courtroomName = courtroomName;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDtm = createdDtm;
        this.updatedDtm = updatedDtm;
        this.revisionCount = revisionCount;
    }

    /** All args constructor. */
    public Courtroom(
            UUID courtroomId,
            Courthouse courthouse,
            String courtroomCd,
            String courtroomName,
            String createdBy,
            String updatedBy,
            Date createdDtm,
            Date updatedDtm,
            long revisionCount,
            List<Assignment> assignments) {
        this.courtroomId = courtroomId;
        this.courthouse = courthouse;
        this.courtroomCd = courtroomCd;
        this.courtroomName = courtroomName;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDtm = createdDtm;
        this.updatedDtm = updatedDtm;
        this.revisionCount = revisionCount;
        this.assignments = assignments;
    }

    public UUID getCourtroomId() {
        return this.courtroomId;
    }

    public void setCourtroomId(UUID courtroomId) {
        this.courtroomId = courtroomId;
    }

    public Courthouse getCourthouse() {
        return this.courthouse;
    }

    public void setCourthouse(Courthouse courthouse) {
        this.courthouse = courthouse;
    }

    public String getCourtroomCd() {
        return this.courtroomCd;
    }

    public void setCourtroomCd(String courtroomCd) {
        this.courtroomCd = courtroomCd;
    }

    public String getCourtroomName() {
        return this.courtroomName;
    }

    public void setCourtroomName(String courtroomName) {
        this.courtroomName = courtroomName;
    }

    public List<Assignment> getAssignments() {
        return this.assignments;
    }

    public void setAssignments(List<Assignment> assignments) {
        this.assignments = assignments;
    }
    
    @Transient
	@Override
	public String getIdPath() {
		return "/courtrooms/" + courtroomId;
	}
}
