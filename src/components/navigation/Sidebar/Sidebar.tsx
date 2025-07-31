import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Gavel as GavelIcon,
  AdminPanelSettings as AdminIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { NavigationItem } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';

const SidebarContainer = styled(Box)(({ theme }) => ({
  width: 280,
  height: '100vh',
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 2),
  borderBottom: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const NavigationList = styled(List)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(1),
  '& .MuiListItemButton-root': {
    borderRadius: theme.spacing(1.5),
    marginBottom: theme.spacing(0.5),
    padding: theme.spacing(1.5, 2),
    transition: 'all 0.2s ease-in-out',
    
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      transform: 'translateX(4px)',
    },
    
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      
      '& .MuiListItemIcon-root': {
        color: 'inherit',
      },
      
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
  
  '& .MuiListItemIcon-root': {
    minWidth: 'auto',
    marginRight: theme.spacing(2),
  },
}));

const UserSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
}));

const getIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    dashboard: <DashboardIcon />,
    search: <SearchIcon />,
    person: <PersonIcon />,
    settings: <SettingsIcon />,
    admin: <AdminIcon />,
  };
  
  return iconMap[iconName] || <DashboardIcon />;
};

interface SidebarProps {
  navigationItems: NavigationItem[];
  onItemClick?: (item: NavigationItem) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ navigationItems, onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleItemClick = (item: NavigationItem) => {
    navigate(item.path);
    onItemClick?.(item);
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <GavelIcon color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5" fontWeight="bold" color="primary">
          LexiAI
        </Typography>
      </SidebarHeader>

      <NavigationList>
        {navigationItems.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton
              className={location.pathname === item.path ? 'active' : ''}
              onClick={() => handleItemClick(item)}
            >
              <ListItemIcon>
                {getIcon(item.icon)}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }}
              />
              {item.badge && (
                <Badge badgeContent={item.badge} color="secondary" />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </NavigationList>

      <UserSection>
        <Avatar
          src={user?.avatar}
          alt={user?.firstName}
          sx={{ width: 40, height: 40 }}
        >
          {user?.firstName?.[0]}{user?.lastName?.[0]}
        </Avatar>
        <Box flex={1}>
          <Typography variant="body2" fontWeight="medium">
            {user?.firstName} {user?.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {user?.firm}
          </Typography>
        </Box>
      </UserSection>
    </SidebarContainer>
  );
};

export default Sidebar;
