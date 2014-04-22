package eu.trentorise.smartcampus.comuneintasca.processor;

import java.util.ArrayList;
import java.util.List;

import org.odftoolkit.simple.SpreadsheetDocument;
import org.odftoolkit.simple.table.Row;
import org.odftoolkit.simple.table.Table;

public class ODFParser {

	public static List<List<String>> parseTable(String uri, int columnCount) throws Exception {
		SpreadsheetDocument td = SpreadsheetDocument.loadDocument(ODFParser.class.getResourceAsStream(uri));
		List<Table> tables = td.getTableList();
		Table table = tables.get(0);
		List<List<String>> result = new ArrayList<List<String>>();
		for (int i = 1; ; i++) {
			Row row = table.getRowByIndex(i);
			List<String> list = new ArrayList<String>();
			for(int j = 0; j < columnCount; j++) {
				list.add(row.getCellByIndex(j).getStringValue());
			}
			if (list.get(0) == null || list.get(0).isEmpty()) break;
			result.add(list);
		}
		return result;
	}
}
