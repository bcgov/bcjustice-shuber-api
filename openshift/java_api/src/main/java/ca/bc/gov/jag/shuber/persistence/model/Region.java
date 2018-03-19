package ca.bc.gov.jag.shuber.persistence.model;

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
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.GenericGenerator;
import org.hibernate.annotations.Parameter;

import ca.bc.gov.jag.shuber.persistence.AbstractAuditableVersionable;

/**
 * Region generated by Hibernate Tools hbm2java.
 *
 * <p>Domain model for database table region.
 *
 * @author hbm2java
 * @version 352
 */
@Entity
@Table(name = "region"
    // ,schema="shersched"
)
public class Region extends AbstractAuditableVersionable implements Serializable {

    /** UID. */
    private static final long serialVersionUID = 1L;

    @GenericGenerator(
        name = "generator",
        strategy = "foreign",
        parameters = @Parameter(name = "property", value = "location")
    )
    @Id
    @GeneratedValue(generator = "generator")
    @Column(name = "location_id", nullable = false, updatable = false)
    private UUID locationId;

    @NotNull
    @OneToOne(fetch = FetchType.EAGER)
    @PrimaryKeyJoinColumn
    private Location location;

    @Column(name = "geometry")
    private UUID geometry;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "region")
    private List<Courthouse> courthouses = new ArrayList<Courthouse>(0);
    
    /** No args constructor. */
    public Region() {}

    /** Required args constructor. */
    public Region(
            Location location,
            String createdBy,
            String updatedBy,
            Date createdDtm,
            Date updatedDtm,
            long revisionCount) {
        this.location = location;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDtm = createdDtm;
        this.updatedDtm = updatedDtm;
        this.revisionCount = revisionCount;
    }

    /** All args constructor. */
    public Region(
            Location location,
            UUID geometry,
            String createdBy,
            String updatedBy,
            Date createdDtm,
            Date updatedDtm,
            long revisionCount,
            List<Courthouse> courthouses) {
        this.location = location;
        this.geometry = geometry;
        this.createdBy = createdBy;
        this.updatedBy = updatedBy;
        this.createdDtm = createdDtm;
        this.updatedDtm = updatedDtm;
        this.revisionCount = revisionCount;
        this.courthouses = courthouses;
    }

    public UUID getLocationId() {
        return this.locationId;
    }

    public void setLocationId(UUID locationId) {
        this.locationId = locationId;
    }

    public Location getLocation() {
        return this.location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public UUID getGeometry() {
        return this.geometry;
    }

    public void setGeometry(UUID geometry) {
        this.geometry = geometry;
    }

    public List<Courthouse> getCourthouses() {
        return this.courthouses;
    }

    public void setCourthouses(List<Courthouse> courthouses) {
        this.courthouses = courthouses;
    }
}
