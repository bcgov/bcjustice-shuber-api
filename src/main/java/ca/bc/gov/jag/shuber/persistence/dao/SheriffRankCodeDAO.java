package ca.bc.gov.jag.shuber.persistence.dao;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import ca.bc.gov.jag.shuber.persistence.model.SheriffRankCode;

/**
 * SheriffRankCodeDAO generated by Hibernate Tools hbm2dao.
 *
 * <p>Domain data access object for database table sheriff_rank_code.
 *
 * @author hbm2dao
 * @version 391
 * @see ca.bc.gov.jag.shuber.persistence.model.SheriffRankCode
 */
@Repository
public interface SheriffRankCodeDAO extends JpaRepository<SheriffRankCode, String> {
    // NOTE: add custom methods here

	/**
	 * Find a sheriff rank code.
	 * @param sheriffRankCode sheriff rank code
	 * @return record
	 */
	Optional<SheriffRankCode> findBySheriffRankCode(@Param("sheriffRankCode") String sheriffRankCode);
	
}
