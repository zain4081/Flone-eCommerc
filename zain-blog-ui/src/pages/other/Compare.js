import * as React from 'react';
import { Fragment, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { useGetNotificationsMutation, useMarkReadMutation } from "../../services/notifyApi";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { getToken } from '../../services/localStorageService';


const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'left',
  color: theme.palette.text.secondary,
  maxWidth: '100%',
  marginBottom: theme.spacing(2),
}));

const Compare = () => {
  const dispatch = useDispatch();
  let { pathname } = useLocation();
  const [getNotifications] = useGetNotificationsMutation();
  const [markRead] = useMarkReadMutation();
  const [notifications, setNotifications] = useState([]);
  const {access_token} = getToken();

  const fetchData = async () => {
    try {
      const response = await getNotifications(access_token);
      if (response.data) {
        setNotifications(response.data.notifications);
      }else{
        setNotifications([])
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const notificationReadHandler = async () => {
    const data = { read: true };
    try {
      const response = await markRead({'data': data, 'access_token': access_token});
      
      if (response.data) {
        fetchData();
      }
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const getTimeDifference = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const differenceInSeconds = Math.floor((now - notificationTime) / 1000);

    if (differenceInSeconds < 60) {
      return `${differenceInSeconds} seconds ago`;
    } else if (differenceInSeconds < 3600) {
      const minutes = Math.floor(differenceInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (differenceInSeconds < 86400) {
      const hours = Math.floor(differenceInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(differenceInSeconds / 86400);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  

  const unreadNotifications = notifications.filter(notification => !notification.read);

  return (
    <Fragment>
      <SEO
        titleTemplate="Notifications"
        description="Notification page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Notifications", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <Box sx={{ flexGrow: 1, overflow: 'hidden', px: 3 }}>
          {unreadNotifications.length > 0 && (
            <Button variant="contained" color="primary" onClick={notificationReadHandler} sx={{ mb: 2 }}>
              Mark as Read
            </Button>
          )}
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <Item key={index}>
                <Stack spacing={2} direction="row" alignItems="center">
                  <Avatar>{notification.message.charAt(0).toUpperCase()}</Avatar>
                  <Stack sx={{ minWidth: 0 }}>
                    <Typography noWrap variant="body1">{notification.message}</Typography>
                    <Typography variant="body2" color="textSecondary">{getTimeDifference(notification.timestamp)}</Typography>
                  </Stack>
                </Stack>
              </Item>
            ))
          ) : (
            <Typography variant="body1">No notifications found {notifications}</Typography>
          )}
        </Box>
      </LayoutOne>
    </Fragment>
  );
};

export default Compare;
