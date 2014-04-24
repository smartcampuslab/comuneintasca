package eu.trentorise.smartcampus.comuneintasca.model;

import java.util.Map;

public class RestaurantObject extends GeoCITObject {
	private static final long serialVersionUID = -5567010752470052310L;

	private Map<String,String> classification;
	private Map<String,String> timetable;
	private Map<String,String> closing;
	private Map<String,String> equipment;
	private Map<String,String> prices;


	public Map<String, String> getClassification() {
		return classification;
	}
	public void setClassification(Map<String, String> classification) {
		this.classification = classification;
	}
	public Map<String, String> getTimetable() {
		return timetable;
	}
	public void setTimetable(Map<String, String> timetable) {
		this.timetable = timetable;
	}
	public Map<String, String> getClosing() {
		return closing;
	}
	public void setClosing(Map<String, String> closing) {
		this.closing = closing;
	}
	public Map<String, String> getEquipment() {
		return equipment;
	}
	public void setEquipment(Map<String, String> equipment) {
		this.equipment = equipment;
	}
	public Map<String, String> getPrices() {
		return prices;
	}
	public void setPrices(Map<String, String> prices) {
		this.prices = prices;
	}
}
