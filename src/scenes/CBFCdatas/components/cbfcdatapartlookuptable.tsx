import React, { useState, useEffect } from "react";

// Define the type for the items in the lookup data
type LookupItem = {
  id: number;
  name: string;
};

// Mock fetch function to simulate fetching data
const fetchLookupData = (): Promise<LookupItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" },
        { id: 4, name: "Item 4" },
        { id: 5, name: "Item 5" },
      ]);
    }, 1000);
  });
};

const LookupTableWithSearch = () => {
  const [lookupData, setLookupData] = useState<LookupItem[]>([]); // Specify the type of lookupData
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    fetchLookupData().then((data) => {
      setLookupData(data); // This will now work correctly
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = lookupData.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h3>Select an Item</h3>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <select value={selectedValue} onChange={(e) => setSelectedValue(e.target.value)}>
        <option value="">--Select--</option>
        {filteredData.map((item) => (
          <option key={item.id} value={item.id.toString()}>
            {item.name}
          </option>
        ))}
      </select>

      <h3>Lookup Table</h3>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedValue && (
        <p>
          You selected:{" "}
          {filteredData.find((item) => item.id === +selectedValue)?.name}
        </p>
      )}
    </div>
  );
};

export default LookupTableWithSearch;