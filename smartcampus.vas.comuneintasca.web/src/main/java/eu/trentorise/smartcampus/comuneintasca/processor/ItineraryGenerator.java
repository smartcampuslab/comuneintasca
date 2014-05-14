package eu.trentorise.smartcampus.comuneintasca.processor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import eu.trentorise.smartcampus.comuneintasca.data.GeoTimeStorage;
import eu.trentorise.smartcampus.comuneintasca.model.GeoCITObject;
import eu.trentorise.smartcampus.comuneintasca.model.ItineraryObject;
import eu.trentorise.smartcampus.network.JsonUtils;
import eu.trentorise.smartcampus.network.RemoteConnector;
import eu.trentorise.smartcampus.network.RemoteException;
import eu.trentorise.smartcampus.presentation.common.exception.DataException;
import eu.trentorise.smartcampus.presentation.common.exception.NotFoundException;

public class ItineraryGenerator {

	@Autowired
	@Value("${google.directions.key}")
	private String apiKey;
	@Autowired
	private GeoTimeStorage storage;
	
	public List<String> generateSteps(ItineraryObject obj) throws NotFoundException, DataException, SecurityException, RemoteException {
		List<double[]> points = new ArrayList<double[]>();
		for (String id : obj.getSteps()) {
			GeoCITObject ref = (GeoCITObject) storage.getObjectById(id);
			points.add(ref.getLocation());
		}
		return extractLinesForItineraryPoints(points);
	}

	private List<String> extractLinesForItineraryPoints(List<double[]> list) throws SecurityException, RemoteException {
		int start = 0;
		int end = Math.min(10, list.size());
		List<String> res = new ArrayList<String>();
		do {
			List<double[]> sub = list.subList(start, end);
			res.addAll(extractLines(callDirections(sub)));
			start = end - 1;
			end = Math.min(end + 10, list.size());
		} while (end < list.size());
		return res;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	private List<String> extractLines(Map<String,Object> response) {
		List<Object> elems = (List<Object>) response.get("routes");
		if (elems == null || elems.isEmpty()) return Collections.emptyList();
		Map<String,Object> elem = (Map<String, Object>) elems.get(0);
		
		elems = (List<Object>) elem.get("legs");
		if (elems == null || elems.isEmpty()) return Collections.emptyList();
		
		List<String> res = new ArrayList<String>();
		for (Object e : elems) {
			Map<String,Object> leg = (Map<String, Object>) e;
			List<Map<String,Object>> steps = (List<Map<String, Object>>) leg.get("steps");
			for (Map<String,Object> step : steps) {
				res.add(((Map)step.get("polyline")).get("points").toString());
			}
		}
		return res;
	}
	
	@SuppressWarnings("unchecked")
	private Map<String,Object> callDirections(List<double[]> points) throws SecurityException, RemoteException {
		if (points == null || points.isEmpty()) return Collections.emptyMap(); 
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("key", apiKey);
		params.put("mode", "walking");
		params.put("origin",toLocation(points.get(0)));
		params.put("destination",toLocation(points.get(points.size()-1)));
		params.put("waypoints", toWaypoints(points));
		
		System.err.println("MAKING A CALL: "+params);
		
		String s = RemoteConnector.getJSON("https://maps.googleapis.com/maps/api/directions/json", "", null, params );
		return JsonUtils.toObject(s, Map.class);
	}

	private String toWaypoints(List<double[]> points) {
		String res = "";
		for (int i = 1; i < points.size()-1;i++) {
			res += toLocation(points.get(i));
			if (i < points.size()-2) {
				res += "|";
			}
		}
		return res;
	}

	private String toLocation(double[] ds) {
		return ds[0]+","+ds[1];
	} 

	public static void main(String[] args) throws SecurityException, RemoteException {
		ItineraryGenerator gen = new ItineraryGenerator();
		List<double[]> list = Arrays.asList(new double[][]{
				new double[]{46.06740299,11.12125087},
				new double[]{46.06753326,11.12144887},
				new double[]{46.06750889,11.12190127},
				new double[]{46.0674754,11.12186372},
				new double[]{46.06743073,11.12192809},
				new double[]{46.06695531,11.12122643},
				new double[]{46.06698614,11.12176001},
				new double[]{46.06774984,11.12168169},
				new double[]{46.06742859,11.12086582},
				new double[]{46.06774139,11.12153435},
				new double[]{46.06908174,11.12144482},
				new double[]{46.06874678,11.12103712},
				new double[]{46.06921461,11.12084436},
				new double[]{46.06980961,11.12103844},
				new double[]{46.06994899,11.12200594},
				new double[]{46.07001998,11.12314749},
				
				new double[]{46.06963954,11.12281513},
				new double[]{46.07222757,11.12483335},
				new double[]{46.07081409,11.12706232},
				new double[]{46.07046425,11.12726617}
		});
		System.err.println(gen.extractLinesForItineraryPoints(list));
	}
}
