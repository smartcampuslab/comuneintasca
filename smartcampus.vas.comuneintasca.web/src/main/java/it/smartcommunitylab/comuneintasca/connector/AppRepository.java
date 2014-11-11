package it.smartcommunitylab.comuneintasca.connector;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface AppRepository extends MongoRepository<App, String> {

    @Query("{'sources.subscriptionId':?0}")
	public App findBySubscriptionId(String subscriptionId);
}
