package eu.trentorise.smartcampus.comuneintasca.data;

import eu.trentorise.smartcampus.presentation.storage.sync.mongo.SyncObjectBean;

public class AppSyncBean extends SyncObjectBean {

	private String appId;
	private String objectId;
	
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getObjectId() {
		return objectId;
	}
	public void setObjectId(String objectId) {
		this.objectId = objectId;
	}
}
