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

import java.util.List;
import java.util.Map;

public class MenuItem {

	private String id;
	private Map<String,String> name;
	private Map<String,String> description;
	private Map<String,String> image;
	private Map<String, List<String>> objectIds;
	private List<MenuItem> items;
	private MenuItemQuery query;
	private String ref;
	private String type;
	private Map<String,String> app;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Map<String, String> getName() {
		return name;
	}
	public void setName(Map<String, String> name) {
		this.name = name;
	}
	public Map<String, String> getDescription() {
		return description;
	}
	public void setDescription(Map<String, String> description) {
		this.description = description;
	}
	public Map<String,String> getImage() {
		return image;
	}
	public void setImage(Map<String,String> image) {
		this.image = image;
	}
	public Map<String, List<String>> getObjectIds() {
		return objectIds;
	}
	public void setObjectIds(Map<String, List<String>> objectIds) {
		this.objectIds = objectIds;
	}
	public List<MenuItem> getItems() {
		return items;
	}
	public void setItems(List<MenuItem> items) {
		this.items = items;
	}
	public MenuItemQuery getQuery() {
		return query;
	}
	public void setQuery(MenuItemQuery query) {
		this.query = query;
	}
	public String getRef() {
		return ref;
	}
	public void setRef(String ref) {
		this.ref = ref;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public Map<String, String> getApp() {
		return app;
	}
	public void setApp(Map<String, String> app) {
		this.app = app;
	}
	
	
}
