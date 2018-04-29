package ca.bc.gov.jag.shuber.util;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Calendar;
import java.util.Date;

/**
 * 
 * @author michael.gabelmann
 */
public final class DateUtil {
	/** Do not instantiate this class. */
	private DateUtil() {}
	
	
	/**
	 * Get a date.
	 * @param year
	 * @param month
	 * @param dayOfMonth
	 * @return
	 */
	public static Date getDate(int year, int month, int dayOfMonth) {
		return DateUtil.getDate(year, month, dayOfMonth, 0, 0, 0);
	}
	
	/**
	 * Get a date.
	 * @param year
	 * @param month
	 * @param dayOfMonth
	 * @param hour
	 * @param minute
	 * @param second
	 * @return
	 */
	public static Date getDate(int year, int month, int dayOfMonth, int hour, int minute, int second) {
		Calendar c = Calendar.getInstance();
		c.setLenient(true);
		c.set(year, month, dayOfMonth, hour, minute, second);
		c.set(Calendar.MILLISECOND, 0);
		
		return c.getTime();
	}
	
	/**
	 * Get date and time.
	 * @param year
	 * @param month
	 * @param dayOfMonth
	 * @param hour
	 * @param minute
	 * @param second
	 * @return
	 */
	public static LocalDateTime getLocalDateTime(int year, int month, int dayOfMonth, int hour, int minute, int second) {
		return LocalDateTime.of(year, month, dayOfMonth, hour, minute, second, 0);
	}
	
	/**
	 * Convert JODA date and time to date.
	 * @param localDateTime
	 * @return
	 */
	public static Date getDate(LocalDateTime localDateTime) {
		assert localDateTime != null : "localDateTime cannot be null";
		
		return Date.from(localDateTime.atZone(ZoneId.systemDefault()).toInstant());
	}
	
	/**
	 * Convert date to JODA date and time.
	 * @param date
	 * @return
	 */
	public static LocalDateTime getLocalDateTime(Date date) {
		assert date != null : "date cannot be null";
		
		return LocalDateTime.ofInstant(date.toInstant(), ZoneId.systemDefault());
	}
	
	/**
	 * Convert a date into a string.
	 * @param date
	 * @return
	 */
	public static String getDateString(Date date) {
		return DateUtil.getDateString(date, Constants.DATE_FORMAT);
	}
	
	/**
	 * Convert a date into a string.
	 * @param date
	 * @param dateformat
	 * @return
	 */
	public static String getDateString(Date date, String dateformat) {
		assert date != null : "date cannot be null";
		assert dateformat != null : "dateformat cannot be null";
		
		SimpleDateFormat sdf = new SimpleDateFormat(dateformat);
		return sdf.format(date);
	}
	
	/**
	 * Java LocalDate does not provide an atEndOfDay method, so we will create our own.
	 * @param date
	 * @return
	 */
	public static LocalDateTime atEndOfDay(LocalDate date) {
		return date.atTime(LocalTime.MAX);
	}
	
	/**
	 * Calculate if we need to create records based on the day of week 
	 * for the given date and whether that matches a bit in the bitmap 
	 * using the following formula.
	 * 
	 * <pre>
	 * mon=1, tues=2, wed=4, thu=8, fri=16, sat=32, sun=64
	 * </pre>
	 * 
	 * @param date
	 * @param daysBitmap
	 * @return true if matches, false otherwise
	 */
	public static boolean createForDate(LocalDate date, long daysBitmap) {
		int dayOfWeek = date.getDayOfWeek().getValue();
		int bitshifted = 1 << (dayOfWeek - 1);
		
		return ((daysBitmap & bitshifted) == bitshifted);
	}
}
