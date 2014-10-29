/*******************************************************************************
 * Copyright 2012-2013 Trento RISE
 * 
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 * 
 *        http://www.apache.org/licenses/LICENSE-2.0
 * 
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 ******************************************************************************/
package eu.trentorise.smartcampus.comuneintasca.model;

import java.util.Map;

import eu.trentorise.smartcampus.presentation.data.BasicObject;

public class BaseCITObject extends BasicObject {
	private static final long serialVersionUID = 3589900794339644582L;

	private String appId;
	private String classifier;
	
	private String source = null;
	private Map<String,String> title = null;
	private Map<String,String> shortTitle = null;
	private Map<String,String> subtitle = null;
	private Map<String,String> description = null;
	private Map<String,String> info = null;
	private String category = null;

	private Map<String,String> contacts = null;
	private String url = null;
	
	private String image = null;

	private Long lastModified = null;
	
	private String objectId;
	
	public String getSource() {
		return source;
	}

	public void setSource(String source) {
		this.source = source;
	}

	public Map<String, String> getTitle() {
		return title;
	}

	public void setTitle(Map<String, String> title) {
		this.title = title;
	}

	public Map<String, String> getShortTitle() {
		return shortTitle;
	}

	public void setShortTitle(Map<String, String> shortTitle) {
		this.shortTitle = shortTitle;
	}

	public Map<String, String> getSubtitle() {
		return subtitle;
	}

	public void setSubtitle(Map<String, String> subtitle) {
		this.subtitle = subtitle;
	}

	public Map<String, String> getDescription() {
		return description;
	}

	public void setDescription(Map<String, String> description) {
		this.description = description;
	}

	public Map<String, String> getInfo() {
		return info;
	}

	public void setInfo(Map<String, String> info) {
		this.info = info;
	}

	public String getCategory() {
		return category;
	}

	public void setCategory(String category) {
		this.category = category;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Map<String, String> getContacts() {
		return contacts;
	}

	public void setContacts(Map<String, String> contacts) {
		this.contacts = contacts;
	}

	public Long getLastModified() {
		return lastModified;
	}

	public void setLastModified(Long lastModified) {
		this.lastModified = lastModified;
	}
	
	public String getObjectId() {
		return objectId;
	}

	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getClassifier() {
		return classifier;
	}

	public void setClassifier(String classifier) {
		this.classifier = classifier;
	}
}
