import React, { useState } from "react";
import { Input, Select } from "antd";
import { PhoneOutlined } from "@ant-design/icons";
import "./PhoneNumberInput.css";

const { Option } = Select;

// Function to get flag emoji from country code
const getFlagEmoji = (countryCode) => {
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...codePoints);
};

// Common country codes with country names (sorted by code)
const countryCodes = [
  { code: "+1", country: "US", name: "United States", flag: getFlagEmoji("US") },
  { code: "+7", country: "RU", name: "Russia", flag: getFlagEmoji("RU") },
  { code: "+20", country: "EG", name: "Egypt", flag: getFlagEmoji("EG") },
  { code: "+27", country: "ZA", name: "South Africa", flag: getFlagEmoji("ZA") },
  { code: "+30", country: "GR", name: "Greece", flag: getFlagEmoji("GR") },
  { code: "+31", country: "NL", name: "Netherlands", flag: getFlagEmoji("NL") },
  { code: "+32", country: "BE", name: "Belgium", flag: getFlagEmoji("BE") },
  { code: "+33", country: "FR", name: "France", flag: getFlagEmoji("FR") },
  { code: "+34", country: "ES", name: "Spain", flag: getFlagEmoji("ES") },
  { code: "+39", country: "IT", name: "Italy", flag: getFlagEmoji("IT") },
  { code: "+41", country: "CH", name: "Switzerland", flag: getFlagEmoji("CH") },
  { code: "+44", country: "GB", name: "United Kingdom", flag: getFlagEmoji("GB") },
  { code: "+45", country: "DK", name: "Denmark", flag: getFlagEmoji("DK") },
  { code: "+46", country: "SE", name: "Sweden", flag: getFlagEmoji("SE") },
  { code: "+47", country: "NO", name: "Norway", flag: getFlagEmoji("NO") },
  { code: "+48", country: "PL", name: "Poland", flag: getFlagEmoji("PL") },
  { code: "+49", country: "DE", name: "Germany", flag: getFlagEmoji("DE") },
  { code: "+52", country: "MX", name: "Mexico", flag: getFlagEmoji("MX") },
  { code: "+55", country: "BR", name: "Brazil", flag: getFlagEmoji("BR") },
  { code: "+60", country: "MY", name: "Malaysia", flag: getFlagEmoji("MY") },
  { code: "+61", country: "AU", name: "Australia", flag: getFlagEmoji("AU") },
  { code: "+62", country: "ID", name: "Indonesia", flag: getFlagEmoji("ID") },
  { code: "+63", country: "PH", name: "Philippines", flag: getFlagEmoji("PH") },
  { code: "+64", country: "NZ", name: "New Zealand", flag: getFlagEmoji("NZ") },
  { code: "+65", country: "SG", name: "Singapore", flag: getFlagEmoji("SG") },
  { code: "+66", country: "TH", name: "Thailand", flag: getFlagEmoji("TH") },
  { code: "+81", country: "JP", name: "Japan", flag: getFlagEmoji("JP") },
  { code: "+82", country: "KR", name: "South Korea", flag: getFlagEmoji("KR") },
  { code: "+84", country: "VN", name: "Vietnam", flag: getFlagEmoji("VN") },
  { code: "+86", country: "CN", name: "China", flag: getFlagEmoji("CN") },
  { code: "+90", country: "TR", name: "Turkey", flag: getFlagEmoji("TR") },
  { code: "+91", country: "IN", name: "India", flag: getFlagEmoji("IN") },
  { code: "+92", country: "PK", name: "Pakistan", flag: getFlagEmoji("PK") },
  { code: "+94", country: "LK", name: "Sri Lanka", flag: getFlagEmoji("LK") },
  { code: "+95", country: "MM", name: "Myanmar", flag: getFlagEmoji("MM") },
  { code: "+351", country: "PT", name: "Portugal", flag: getFlagEmoji("PT") },
  { code: "+353", country: "IE", name: "Ireland", flag: getFlagEmoji("IE") },
  { code: "+358", country: "FI", name: "Finland", flag: getFlagEmoji("FI") },
  { code: "+880", country: "BD", name: "Bangladesh", flag: getFlagEmoji("BD") },
  { code: "+966", country: "SA", name: "Saudi Arabia", flag: getFlagEmoji("SA") },
  { code: "+971", country: "AE", name: "UAE", flag: getFlagEmoji("AE") },
  { code: "+977", country: "NP", name: "Nepal", flag: getFlagEmoji("NP") },
];

const PhoneNumberInput = ({
  value,
  onChange,
  placeholder = "Enter phone number",
  size = "large",
  className = "",
  disabled = false,
  prefix = <PhoneOutlined />,
  defaultCountryCode = "+91",
  ...rest
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(defaultCountryCode);
  const [phoneNumber, setPhoneNumber] = useState("");

  // Parse initial value if provided
  React.useEffect(() => {
    if (value) {
      // Check if value already contains country code
      const foundCountry = countryCodes.find((country) => value.startsWith(country.code));
      if (foundCountry) {
        setSelectedCountryCode(foundCountry.code);
        setPhoneNumber(value.replace(foundCountry.code, "").trim());
      } else {
        // Assume default country code if no match
        setPhoneNumber(value);
      }
    }
  }, [value]);

  const handleCountryCodeChange = (code) => {
    setSelectedCountryCode(code);
    const fullNumber = phoneNumber ? `${code}${phoneNumber}` : "";
    onChange?.(fullNumber);
  };

  const handlePhoneNumberChange = (e) => {
    const number = e.target.value.replace(/\D/g, ""); // Only allow digits
    setPhoneNumber(number);
    const fullNumber = number ? `${selectedCountryCode}${number}` : "";
    onChange?.(fullNumber);
  };

  const selectedCountry = countryCodes.find(c => c.code === selectedCountryCode);

  return (
    <Input.Group compact className={`phone-number-input-group ${className}`}>
      <Select
        value={selectedCountryCode}
        onChange={handleCountryCodeChange}
        size={size}
        disabled={disabled}
        showSearch
        filterOption={(input, option) => {
          const searchText = input.toLowerCase().trim();
          if (!searchText) return true;
          
          const country = countryCodes.find(c => c.code === option.value);
          if (!country) return false;
          
          // Search by country code (e.g., "+91", "91", "+1")
          const codeMatch = country.code.toLowerCase().includes(searchText) || 
                           country.code.replace("+", "").includes(searchText);
          
          // Search by country name (e.g., "india", "united states")
          const nameMatch = country.name.toLowerCase().includes(searchText);
          
          // Search by country code (e.g., "IN", "US")
          const countryCodeMatch = country.country.toLowerCase().includes(searchText);
          
          return codeMatch || nameMatch || countryCodeMatch;
        }}
        optionLabelProp="label"
        className="country-code-select"
        title={selectedCountry?.name}
        placeholder=""
      >
        {countryCodes.map((country) => (
          <Option 
            key={country.code} 
            value={country.code}
            label={
              <span className="selected-country-display">
                <span className="country-flag">{country.flag}</span>
                <span className="country-code">{country.code}</span>
              </span>
            }
            title={country.name}
          >
            <span className="country-option-content" title={country.name}>
              <span className="country-flag">{country.flag}</span>
              <span className="country-code">{country.code}</span>
              <span className="country-name-hover">{country.name}</span>
            </span>
          </Option>
        ))}
      </Select>
      <Input
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder={placeholder}
        size={size}
        disabled={disabled}
        prefix={prefix}
        style={{ flex: 1, minWidth: 0 }}
        className="phone-number-input"
        maxLength={15}
        {...rest}
      />
    </Input.Group>
  );
};

export default PhoneNumberInput;
