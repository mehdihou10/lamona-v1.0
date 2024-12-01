import {AdminNavbar,AdminSettings} from '@/components';

const AdminLayout = ({children}) => {
    
  return (
    <>

        <AdminSettings>
            
        <AdminNavbar />
        {children}

        </AdminSettings>
      
    </>
  )
}

export default AdminLayout
