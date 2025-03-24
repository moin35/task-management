import React, { useState } from "react";
import { TextField } from "@mui/material";
import { debounce } from "lodash";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = debounce((event) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  }, 500);

  return <TextField label="Search Tasks" variant="outlined" fullWidth onChange={handleSearch} />;
};

export default SearchBar;
