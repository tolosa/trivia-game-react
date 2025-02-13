import { AppBar, Container, Typography } from "@mui/material";
import PropTypes from "prop-types";

export const Layout = ({ title, children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="sticky">
        <Container
          sx={{
            maxWidth: "lg",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            py: 1.5,
          }}
        >
          <Typography variant="h5">{title}</Typography>
        </Container>
      </AppBar>
      <Container
        sx={{
          maxWidth: "lg",
          mx: "auto",
          my: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
      >
        {children}
      </Container>
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
