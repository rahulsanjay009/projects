import { useState } from 'react';
import styles from './HomePage.module.css'
import { Button } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../Authorization/useAuth';

const HomePage = () => {
    const location = useLocation()
    const path = location.pathname
    const paths = {'/':'S','/scheduledPickups':'S','/orders':'O','/oldOrders':'OO','/inventory':'I'}
    const [component,setComponent] = useState(paths[path]);
    const navigate = useNavigate();
    // const { logout } = useAuth();

    return (
        <div>
            
            <div>
                <Button className ={styles.nav_button}
                    variant={(component == 'S')?'contained' : 'outlined'}
                    onClick={() => {navigate('/scheduledPickups'); setComponent('S')}}
                    > 
                    Scheduled Pickups
                </Button>
                <Button className ={styles.nav_button}
                    variant={(component == 'O')?'contained' : 'outlined'}
                    onClick={() => {navigate('/orders'); setComponent('O')}}
                    > 
                   Current Orders 
                </Button>
                <Button className = {styles.nav_button}
                    variant={(component == 'OO')?'contained' : 'outlined'}
                    onClick={() => {navigate('/oldOrders'); setComponent('OO')}} 
                    > 
                    Old Orders 
                </Button>
                <Button className = {styles.nav_button}
                    variant={(component == 'I')?'contained' : 'outlined'}
                    onClick={() => {navigate('/inventory'); setComponent('I')}} 
                    > 
                    Inventory 
                </Button>
                <Button className = {styles.nav_button}
                    variant={(component == 'RE')?'contained' : 'outlined'}
                    onClick={() => {navigate('/recentEvents'); setComponent('RE')}} 
                    > 
                    Recent Events
                </Button>
                <Button className = {styles.nav_button}
                    variant={(component == 'C')?'contained' : 'outlined'}
                    onClick={() => {navigate('/categories'); setComponent('C')}} 
                    > 
                    Categories
                </Button>

                <Button className = {styles.nav_button}
                    variant='outlined'
                    color="error"
                    sx={{alignSelf: 'right', float: 'right'}}
                    onClick={() => {
                        // logout(); 
                        navigate('/authorize')
                    }} 
                    > 
                    Logout
                </Button>
                
            </div>
            
            <Outlet/>
            
        </div>
    )
}

export default HomePage;