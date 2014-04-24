package eu.trentorise.smartcampus.comuneintasca.model;

import java.util.Map;

public class HotelObject extends GeoCITObject {
	private static final long serialVersionUID = -5567010752470052310L;

	private Map<String,String> classification;
	private Integer stars;


	public Map<String, String> getClassification() {
		return classification;
	}
	public void setClassification(Map<String, String> classification) {
		this.classification = classification;
	}
	public Integer getStars() {
		return stars;
	}
	public void setStars(Integer stars) {
		this.stars = stars;
	}
}
