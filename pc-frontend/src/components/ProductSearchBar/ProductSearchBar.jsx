import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import Paper from '@mui/material/Paper';
import { useState } from "react";
import { MdSearch as SearchIcon} from 'react-icons/md';

const ProductSearchBar = ({selectSearchText}) => {
    const [searchText,setSearchText] = useState('')

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchText(value);
        selectSearchText(value); // Assuming this is another function you're calling
    };
    return(
        <Box display={'flex'} justifyContent={'center'}  width={'100%'}>
            <Paper
                elevation={2} 
                style={{ display: 'flex', alignItems: 'center', padding: '4px 12px', width:'50%'}}
                >
                <SearchIcon />
                <InputBase 
                    id="outlined-basic" 
                    placeholder="Search Products" 
                    variant="outlined" 
                    onChange={handleSearchChange}
                    value={searchText}
                    style={{ marginLeft: 8 , width:'100%'}}
                />
            </Paper>
        </Box>
    )
}

export default ProductSearchBar;