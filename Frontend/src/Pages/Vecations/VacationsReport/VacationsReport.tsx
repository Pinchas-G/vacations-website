import { useEffect, useState } from "react";
import "./VacationsReport.css";
import followersService from "../../../Services/FollowersService";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FollowersPerDestination } from "../../../Models/FollowerModel";
import notifyService from "../../../Services/NotifyService";
import { exportToCSV } from "../../../Services/ExportService";
import { useSelector } from "react-redux";
import { RootState } from "../../../Redux/Store";

const VacationsReport = () => {
    const theme = useSelector((state: RootState) => state.settings.theme);
    const [followersPerDestination, setFollowersPerDestination] = useState<FollowersPerDestination[]>([]);
    useEffect(() => {
        (async () => {
            try {
                const followersPerDestination = await followersService.getFollowersPerDestination();
                setFollowersPerDestination(followersPerDestination);
            } catch (error: any) {
                notifyService.error(error);
            }
        })()
    }, [])

    const handleExport = () => {
        try {
            exportToCSV(followersPerDestination, 'vacation_data.csv');
            notifyService.success('Yeaaa!!');
        } catch (error: any) {
            notifyService.error(error);
        }
    }
    return (
        <div style={{ width: "100%", height: "100%", display: "flex", flexFlow: "column", rowGap: "10px" }}>
            <button className="cool" onClick={handleExport} style={{ marginRight: "auto" }}>Export</button>
            <div style={{ flexGrow: "1" }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={followersPerDestination}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        barSize={20}
                    >
                        <XAxis dataKey="destination" scale="point" padding={{ left: 10, right: 10 }} />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid strokeDasharray={theme === 'dark'? "1 6" : "0 0"} />
                        <Bar dataKey="followers" fill={theme === 'dark' ? '#e1928e' : '#4F8380'} background={{ fill: '#eee' }} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
export default VacationsReport;