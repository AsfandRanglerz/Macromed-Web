import React, { useEffect, useState, forwardRef } from "react";
import "./checkout.css";

const SelectRegion = forwardRef(
  (
    {
      country,
      state,
      city,
      names,
      labels,
      onChange,
      countryError,
      countryType,
      setError,
      flag = true,
      flag1 = true,
    },
    ref
  ) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);

    const apiKey = "TExJVmdYa1pFcWFsRWViS0c3dDRRdTdFV3hnWXJveFhQaHoyWVo3Mw==";

    // Fetch countries on component mount
    useEffect(() => {
      fetch("https://api.countrystatecity.in/v1/countries", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-CSCAPI-KEY": apiKey,
        },
      })
        .then((response) => response.json())
        .then((result) => setCountries(result))
        .catch((err) => console.error("Error fetching countries:", err));
    }, []);

    // Fetch states when a country is selected or pre-set
    useEffect(() => {
      if (country) {
        const countryCode = country.split(",,")[0]; // Extract ISO2 code
        fetch(
          `https://api.countrystatecity.in/v1/countries/${countryCode}/states`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "X-CSCAPI-KEY": apiKey,
            },
          }
        )
          .then((response) => response.json())
          .then((result) => {
            setStates(result);
            if (state) {
              const selectedState = result.find((s) => s.name === state);
              if (selectedState) {
                fetchCities(selectedState.iso2, countryCode);
              }
            }
          })
          .catch((err) => console.error("Error fetching states:", err));
      }
    }, [country]);

    // Fetch cities when a state is selected or pre-set
    useEffect(() => {
      if (state) {
        const stateCode = state.split(",,")[0];
        const countryCode = country.split(",,")[0];
        fetchCities(stateCode, countryCode);
      }
    }, [state]);

    // Helper function to fetch cities
    const fetchCities = (stateCode, countryCode) => {
      fetch(
        `https://api.countrystatecity.in/v1/countries/${countryCode}/states/${stateCode}/cities`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSCAPI-KEY": apiKey,
          },
        }
      )
        .then((response) => response.json())
        .then((result) => setCities(result))
        .catch((err) => console.error("Error fetching cities:", err));
    };

    return (
      <>
        <select
          className="border-bottom-0 form-select select-radius py-2 input-field"
          value={country}
          onChange={(e) => onChange(e)}
          ref={ref[0]}
          name={names[0]}
        >
          <option value="" disabled selected>
            Select Country
          </option>
          {countries.map((country, index) => (
            <option value={`${country.iso2},,${country.name}`} key={index}>
              {country.name}
            </option>
          ))}
        </select>

        {countryError && (
          <p className="small mb-0 text-danger mt-1">
            {countryType} is required
          </p>
        )}

        {flag1 && (
          <select
            className="form-select select-radius border-bottom-0 py-2 input-field"
            value={state}
            name={names[1]}
            onChange={(e) => onChange(e)}
            ref={ref[1]}
          >
            <option value="" disabled selected>
              Select State
            </option>
            {states.length ? (
              states.map((state, index) => (
                <option value={`${state.iso2},,${state.name}`} key={index}>
                  {state.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                Select State
              </option>
            )}
          </select>
        )}

        {flag1 && (
          <select
            className="form-select py-2 border-bottom-0 select-radius input-field"
            value={city}
            name={names[2]}
            onChange={(e) => onChange(e)}
            ref={ref[2]}
          >
            <option value="" disabled selected>
              Select City
            </option>
            {cities.length ? (
              cities.map((city, index) => (
                <option key={index} value={city.name}>
                  {city.name}
                </option>
              ))
            ) : (
              <option value="" disabled>
                No Cities Available
              </option>
            )}
          </select>
        )}
      </>
    );
  }
);

export default SelectRegion;
