import { Box, useMediaQuery } from '@mui/material';
import {
  layoutMaxWidth,
  menuBarHeight,
  paddingLayoutBottomDesktop,
  paddingLayoutBottomMobile,
  paddingLayoutLeftRightDesktop,
  paddingLayoutLeftRightMobile,
  paddingLayoutTopDesktop,
  paddingLayoutTopMobile,
} from 'globalConfig';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const isDesktop = useMediaQuery(`(min-width: ${layoutMaxWidth}px)`);

  return (
    <Box
      sx={{
        margin: '0 auto',
        height: '100%',
        minHeight: '100vh',
        width: '100%',
        maxWidth: `${layoutMaxWidth}px`,
        padding: `${menuBarHeight + (isDesktop ? paddingLayoutTopDesktop : paddingLayoutTopMobile)}px ${
          isDesktop ? paddingLayoutLeftRightDesktop : paddingLayoutLeftRightMobile
        }px ${isDesktop ? paddingLayoutBottomDesktop : paddingLayoutBottomMobile}px`,
      }}
    >
      {children}
    </Box>
  );
};

export default Layout;
