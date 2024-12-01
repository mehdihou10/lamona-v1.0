"use client";

import {useState,useEffect} from 'react';
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';
import { PageLoading } from '@/components';
import { MdPeople,MdOutlineProductionQuantityLimits } from "react-icons/md";
import { FaBorderAll } from "react-icons/fa";
import { ThreeDots } from 'react-loader-spinner';
import Chart from "react-apexcharts";


const Stat = ({title,icon,data})=>(

  <div className="bg-white px-[20px] py-[15px] rounded-[6px] shadow-lg flex justify-between items-center">
    <div className="text">
      <h3 className='italic tetx-[20px] text-gray-500 font-semibold'>{title}</h3>
      <h1 className='mt-[5px] text-[30px] font-bold'>{data}</h1>
    </div>

    <div className="icon text-[30px] dashboard-icon">
      {icon}
    </div>
  </div>
)

const Admin = () => {

  const router = useRouter();

  const [stats,setStats] = useState({})

  let paymentChart;
  let ordersChart;

  if(Object.keys(stats).length > 0){
  
   paymentChart = {

    chart_one_options :{
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: ["Online Orders","Offline Orders"]
      }
    },
  
     chart_one_series : [
      {
        name: "orders",
        data: [stats.onlineOrders, stats.offlineOrders]
      }
    ]
   }


  ordersChart = {
    series: [stats.clientsPercentage],
    options: {
      chart: {
        height: 350,
        type: "radialBar",
        offsetY: -10,
      },
      plotOptions: {
        radialBar: {
          startAngle: -135,
          endAngle: 135,
          dataLabels: {
            name: {
              fontSize: "16px",
              color: undefined,
              offsetY: 120,
            },
            value: {
              offsetY: 76,
              fontSize: "22px",
              color: undefined,
              formatter: function (val) {
                return val + "%";
              },
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          shadeIntensity: 0.15,
          inverseColors: false,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 50, 65, 91],
        },
      },
      stroke: {
        dashArray: 4,
      },
      labels: ["Clients ratio From Users"],
    },
  };

}

  useEffect(()=>{

    (
      async function(){

        try{

          const res = await fetch("/api/admin/stats",{
            headers: {
              "ath": "admin"
            }
          });

          if(res.ok){

            const data = await res.json();

            const statsData = data.data;

            console.log(statsData)
            setStats(statsData);

          } else{

            router.push('/')
          }

        } catch(err){

          console.log(err)
        }


      }
    )()

  },[])

  return (
    <>
      {
        Object.keys(stats).length === 0 ? 

        <ThreeDots
        visible={true}
        height="100"
        width="100"
        color="#0d53bb"
        radius="9"
        ariaLabel="three-dots-loading"
      />

        : 

        <div className="my-[50px]">        
        
        <div className="px-[50px]">

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-[20px]">
            <Stat title="Total Users" data={stats.users} icon={<MdPeople />} />
            <Stat title="Total Orders" data={stats.orders} icon={<FaBorderAll />} />
            <Stat title="Total Products" data={stats.products} icon={<MdOutlineProductionQuantityLimits />} />

          </div>
        </div>

        <div className="px-[5px] sm:px-[20px] grid xl:grid-cols-2 gap-[20px] mt-[40px]">

           <div className="grid place-items-center px-[20px] py-[15px] rounded-[6px] bg-white">
           <Chart
              options={paymentChart.chart_one_options}
              series={paymentChart.chart_one_series}
              type="bar"
              width="100%"
            />
           </div>


            <div className="px-[20px] py-[15px] rounded-[6px] bg-white">
            <Chart
                options={ordersChart.options}
                series={ordersChart.series}
                type="radialBar"
                height={350}
                width={"100%"}
              />
            </div>

        </div>

        </div>
      }
    </>
  )
}

export default Admin
