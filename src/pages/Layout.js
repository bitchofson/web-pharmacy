import { AppBar, MenuItem, Typography} from "@mui/material";
import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
  <>
    <AppBar position="static" style={{ background: '#2E3B55' }}>
      <MenuItem>
        <Typography textAlign="center">
          <Link to="/drug">Лекарства&nbsp;&nbsp;&nbsp;</Link>
        </Typography>
        <Typography textAlign="center">
          <Link to="/release-form">Форма выпуска&nbsp;&nbsp;&nbsp;</Link>
        </Typography>
        <Typography textAlign="center">
          <Link to="/manufacturer">Производители&nbsp;&nbsp;&nbsp;</Link>
        </Typography>
        <Typography textAlign="center">
          <Link to="/pharmacy">Аптеки&nbsp;&nbsp;&nbsp;</Link>
        </Typography>
        <Typography textAlign="center">
          <Link to="/availability">Наличие&nbsp;&nbsp;&nbsp;</Link>
        </Typography>
      </MenuItem>
    </AppBar>
    <Outlet />
  </>
  )
};

export default Layout;