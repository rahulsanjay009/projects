import  Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { useLocation, useNavigate } from "react-router-dom";
import useCategories from "../../utils/useCategories";

const SideBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = decodeURIComponent(location.pathname).slice(1); // Remove leading slash
    const { categories } = useCategories();
    return (
      <Box
        sx={{
          width: 'auto',
          backgroundColor: "#f8f8f8",
          borderRadius: 2,
          boxShadow: 2,
          m:1,
          p:1,
          zIndex:2,
          position: 'sticky',
          height:'100%',
          top:50,
        }}
      >
        <Typography variant="body1" padding={1}>
          Browse by
        </Typography>
        <Box sx={{
          width: 'auto',
          height:'75vh',
          overflowY: "auto",
          overflowX:'hidden',
          "&::-webkit-scrollbar": {
            width: "2px", // set desired width
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#c1c1c1", // thumb color
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f1f1", // track color
          },
        }}>
        {[{name:'ALL'},...categories].map((cat) => {
          const isSelected = cat.name.toLowerCase() === currentPath.toLowerCase();
          return (
            <Box
              key={cat.name}
              sx={{
                m:1,
                px:1,
                borderRadius: 1,
                cursor: "pointer",
                color: isSelected ? "success.dark" : "#253529",
                fontWeight:isSelected?'bold':'400',
                transition: "0.2s",
                "&:hover": {
                  color: "success.dark",
                },
                fontSize:'14px',
                minWidth:'200px'
              }}
              onClick={() => navigate(`/${encodeURIComponent(cat.name)}`)}
            >
              {cat.name}
            </Box>
          );
        })}
        </Box>
      </Box>
    )
}

export default SideBar;