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
package eu.trentorise.smartcampus.comuneintasca.processor;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
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
		return extractLineForItineraryPoints(points);
	}

	private List<String> extractLineForItineraryPoints(List<double[]> list) throws SecurityException, RemoteException {
		List<String> res = new ArrayList<String>();
		double[] prev = list.get(0);
		for (int i = 0; i < list.size()-1; i++) {
			List<String> strings = extractLines(callDirections(prev, list.get(i+1)));
			List<double[]> decodedStep = new ArrayList<double[]>();
			if (strings.size() == 0) continue;
			for (String s : strings) {
				Collection<double[]> decoded = decodeLine(s); 
				decodedStep.addAll(decoded);
			}
			if (decodedStep.size() == 2 && 
					Arrays.equals(decodedStep.get(0), prev) &&
					Arrays.equals(decodedStep.get(1), list.get(i+1))) 
			{
				continue;
			} else {
				List<double[]> points = new ArrayList<double[]>();
				points.add(prev);
				points.addAll(decodedStep);
				prev = list.get(i+1);
				points.add(prev);
				res.add(encodeLine(points));
			}
		}
		return res;
	}
	
	private String toString(Collection<double[]> decoded) {
		String s = "[";
		for (double[] p : decoded) {
			s += Arrays.toString(p)+" ";
		}
		return s+"]";
	}
	private String toStringInt(Collection<double[]> decoded) {
		String s = "";
		for (double[] p : decoded) {
			s += "("+Arrays.toString(p)+") Level: 3\n";
		}
		return s+"";
	}

	private String encodeLine(List<double[]> points) {
		return PolylineEncoder.encode(points);
	}

	private Collection<double[]> decodeLine(String s) {
		return PolylineEncoder.decode(s);
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
	private Map<String,Object> callDirections(double[] from, double[] to) throws SecurityException, RemoteException {
		if (from == null || to == null) return Collections.emptyMap(); 
		
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("key", apiKey);
		params.put("mode", "walking");
		params.put("origin",toLocation(from));
		params.put("destination",toLocation(to));
		
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
		}
		
		String s = RemoteConnector.getJSON("https://maps.googleapis.com/maps/api/directions/json", "", null, params );
		return JsonUtils.toObject(s, Map.class);
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
		System.err.println(gen.extractLineForItineraryPoints(list));
	}
}
