package eu.trentorise.smartcampus.comuneintasca.model;

import java.util.List;

public class ItineraryObject extends BaseCITObject {
	private static final long serialVersionUID = 6325381726807197185L;

	private List<String> steps;
	private Integer length;
	private Integer duration;
	private String difficulty;
	
	private List<String> stepLines;
	
	public List<String> getSteps() {
		return steps;
	}
	public void setSteps(List<String> steps) {
		this.steps = steps;
	}
	public Integer getLength() {
		return length;
	}
	public void setLength(Integer length) {
		this.length = length;
	}
	public Integer getDuration() {
		return duration;
	}
	public void setDuration(Integer duration) {
		this.duration = duration;
	}
	public String getDifficulty() {
		return difficulty;
	}
	public void setDifficulty(String difficulty) {
		this.difficulty = difficulty;
	}
	public List<String> getStepLines() {
		return stepLines;
	}
	public void setStepLines(List<String> stepLines) {
		this.stepLines = stepLines;
	}
	
}
