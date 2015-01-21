package it.smartcommunitylab.comuneintasca.core.data;

import eu.trentorise.smartcampus.presentation.storage.sync.mongo.SyncObjectBean;

public class AppSyncBean extends SyncObjectBean {

	private String appId;
	private String localId;
	
	public String getAppId() {
		return appId;
	}
	public void setAppId(String appId) {
		this.appId = appId;
	}
	public String getLocalId() {
		return localId;
	}
	public void setLocalId(String localId) {
		this.localId = localId;
	}
}
