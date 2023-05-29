import { useState } from "react";
import { Box, Tab, Tabs } from "@mui/material";
import Swap from "./components/Swap";
import Portfolio from "./components/Portfolio";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function App() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ConnectButton />

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Swap" />
          <Tab label="Portfolio" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Swap />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Portfolio />
      </TabPanel>
    </Box>
  );
}

function TabPanel(props: any) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}
