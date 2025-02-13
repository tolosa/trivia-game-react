import { AppBar, Container, Icon, Typography } from "@mui/material";
import PropTypes from "prop-types";

export const Layout = ({ title, icon, children }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <AppBar position="sticky">
        <Container
          sx={{
            maxWidth: "lg",
            mx: "auto",
            display: "flex",
            alignItems: "center",
            textShadow: "0px 0px 12px rgba(255, 255, 255, 0.4)",
            py: 1.2,
          }}
        >
          {icon && <Icon sx={{ fontSize: "3.3rem", mr: 0.3 }}>{icon}</Icon>}
          <Typography
            variant="h4"
            sx={{
              fontVariant: "small-caps",
              fontWeight: "bold",
            }}
          >
            {title}
          </Typography>
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
  icon: PropTypes.string,
  children: PropTypes.node.isRequired,
};
