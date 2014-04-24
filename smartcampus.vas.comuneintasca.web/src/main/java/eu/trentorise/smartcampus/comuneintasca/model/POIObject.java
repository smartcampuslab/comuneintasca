package eu.trentorise.smartcampus.comuneintasca.model;

import java.util.Map;

public class POIObject extends GeoCITObject {
	private static final long serialVersionUID = -5567010752470052310L;

	private Map<String,String> classification;
	private String relatedObjectId;
	private String contactFullName;

	public Map<String, String> getClassification() {
		return classification;
	}
	public void setClassification(Map<String, String> classification) {
		this.classification = classification;
	}
	public String getRelatedObjectId() {
		return relatedObjectId;
	}
	public void setRelatedObjectId(String relatedObjectId) {
		this.relatedObjectId = relatedObjectId;
	}
	public String getContactFullName() {
		return contactFullName;
	}
	public void setContactFullName(String contackFullName) {
		this.contactFullName = contackFullName;
	}
}
