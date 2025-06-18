// src/components/Footer.jsx
import { Box, Typography, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";

export default function Footer() {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: "#212529",
                padding: "20px 0",
                textAlign: "center",
                borderTop: "4px solid #333",
                mt: 4,
            }}
        >
            <Typography variant="body1" color="#fff">
                © 2025 Amigos Peludos. Todos los derechos reservados.
            </Typography>
            {/* <Box mt={1} >
                <IconButton
                    href="#"
                    target="_blank"
                    aria-label="Facebook"
                    size="small"
                >
                    <FacebookIcon fontSize="small" />
                </IconButton>
                <IconButton
                    href="#"
                    target="_blank"
                    aria-label="Instagram"
                    size="small"
                >
                    <InstagramIcon fontSize="small" />
                </IconButton>
                <IconButton
                    href="#"
                    target="_blank"
                    aria-label="Twitter"
                    size="small"
                >
                    <TwitterIcon fontSize="small" />
                </IconButton>
            </Box> */}
        </Box>
    );
}
