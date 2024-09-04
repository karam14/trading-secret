import SidebarWrapper from "./_components/sidebar-wrapper";
import { Navbar } from "./_components/navbar";

const DashboardLayout = ({
  children
}: { children: React.ReactNode }) => {
  return (
    <>
    <div className="md:pr-12 z-50">
      
            <Navbar />
    </div>

      <SidebarWrapper>
      {children}
    </SidebarWrapper>
      </>
  );
};

export default DashboardLayout;
