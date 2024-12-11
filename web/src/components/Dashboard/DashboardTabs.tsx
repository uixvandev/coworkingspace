import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import { BookingTab, ReservationTab } from './ReservationTab/ReservationTab';
import { UpcomingBookingsTab } from './UpcomingReservationsTab/UpcomingReservationsTab';
import { useUser } from '../../context/UserContext';
import { AdminReservationTab } from './AdminTab/AdminReservationTab';
import { AdminPaymentTab } from './AdminTab/AdminPaymentTab';
import { AdminCoworkingTab } from './AdminTab/AdminCoworkingTab';
import { AdminUserTab } from './AdminTab/AdminUserTab';
import { NotificationTab } from './NotificationTab/NotificationTab';

export const DashboardTabs = () => {
    const { user } = useUser();
    const [tabOpen, setTabOpen] = useState<boolean[]>(user.role === 'admin' ? [true, false, false, false] : [true, false, false]);

    const openTab = (tab: number) => {
        const newTabOpen: boolean[] = user.role === 'admin' ? [false, false, false, false] : [false, false, false];
        newTabOpen[tab] = true;
        setTabOpen(newTabOpen);
    }

    return (
        <Tabs.Root className="flex flex-col w-5/6 mx-auto py-8" defaultValue="tab1">
            <Tabs.List className="flex" aria-label="Manage your account">
                {user.role === 'admin' ? (
                    // Admin Tabs
                    <>
                        <Tabs.Trigger onClick={() => openTab(0)} className={`px-4 flex h-12 items-center justify-center border-b ${tabOpen[0] ? 'text-highlight border-highlight' : 'text-paragraph border-background hover:cursor-pointer hover:text-main duration-100'} text-xl font-semibold mobile:px-2 mobile:text-sm`} value="tab1">
                            Reservations
                        </Tabs.Trigger>
                        {/* <Tabs.Trigger onClick={() => openTab(1)} className={`px-4 flex h-12 items-center justify-center border-b ${tabOpen[1] ? 'text-highlight border-highlight' : 'text-paragraph border-background hover:cursor-pointer hover:text-main duration-100'} text-xl font-semibold mobile:px-2 mobile:text-sm`} value="tab2">
                            Payments
                        </Tabs.Trigger> */}
                        <Tabs.Trigger onClick={() => openTab(2)} className={`px-4 flex h-12 items-center justify-center border-b ${tabOpen[2] ? 'text-highlight border-highlight' : 'text-paragraph border-background hover:cursor-pointer hover:text-main duration-100'} text-xl font-semibold mobile:px-2 mobile:text-sm`} value="tab3">
                            Coworking
                        </Tabs.Trigger>
                        <Tabs.Trigger onClick={() => openTab(3)} className={`px-4 flex h-12 items-center justify-center border-b ${tabOpen[3] ? 'text-highlight border-highlight' : 'text-paragraph border-background hover:cursor-pointer hover:text-main duration-100'} text-xl font-semibold mobile:px-2 mobile:text-sm`} value="tab4">
                            Users
                        </Tabs.Trigger>
                    </>
                ) : (
                    // User Tabs
                    <>
                        <Tabs.Trigger onClick={() => openTab(0)} className={`px-4 flex h-12 items-center justify-center border-b ${tabOpen[0] ? 'text-highlight border-highlight' : 'text-paragraph border-background hover:cursor-pointer hover:text-main duration-100'} text-xl font-semibold mobile:px-2 mobile:text-sm`} value="tab1">
                            Reservation
                        </Tabs.Trigger>
                        <Tabs.Trigger onClick={() => openTab(1)} className={`px-4 flex h-12 items-center justify-center border-b ${tabOpen[1] ? 'text-highlight border-highlight' : 'text-paragraph border-background hover:cursor-pointer hover:text-main duration-100'} text-xl font-semibold mobile:px-2 mobile:text-sm`} value="tab2">
                            Riwayat Reservations
                        </Tabs.Trigger>
                        <Tabs.Trigger onClick={() => openTab(3)} className={`px-4 flex h-12 items-center justify-center border-b ${tabOpen[3] ? 'text-highlight border-highlight' : 'text-paragraph border-background hover:cursor-pointer hover:text-main duration-100'} text-xl font-semibold mobile:px-2 mobile:text-sm`} value="tab4">
                            Notification
                        </Tabs.Trigger>
                    </>
                )}
            </Tabs.List>

            {user.role === 'admin' ? (
                // Admin Content
                <>
                    <Tabs.Content className='h-full' value="tab1">
                        <AdminReservationTab />
                    </Tabs.Content>
                    {/* <Tabs.Content className='h-full' value="tab2">
                        <AdminPaymentTab />
                    </Tabs.Content> */}
                    <Tabs.Content className='h-full' value="tab3">
                        <AdminCoworkingTab />
                    </Tabs.Content>
                    <Tabs.Content className='h-full' value="tab4">
                        <AdminUserTab />
                    </Tabs.Content>
                </>
            ) : (
                // User Content
                <>
                    <Tabs.Content className='h-full' value="tab1">
                        <ReservationTab />
                    </Tabs.Content>
                    <Tabs.Content className='h-full' value="tab2">
                        <UpcomingBookingsTab />
                    </Tabs.Content>
                    
                    <Tabs.Content className='h-full' value="tab4">
                        <NotificationTab />
                    </Tabs.Content>
                </>
            )}
        </Tabs.Root>
    )
}
