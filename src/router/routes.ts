import { ADMINKEY } from "../core/contants";
import { getLocalData } from "../libs/localData";
import { Role } from "../models/enums";
import AddItem from "../views/admin/AddItem.vue";
import Dashboard from "../views/admin/Dashboard.vue";
import Login from "../views/admin/Login.vue";
import Register from "../views/admin/Register.vue";
import Booking from "../views/booking/Booking.vue";
import ReqBooking from "../views/booking/ReqBooking.vue";
import Home from "../views/home/Home.vue";
import Loan from "../views/loan/Loan.vue";
import LoanItem from "../views/loan/LoanItem.vue";
import UserLogin from "../views/user/UserLogin.vue";
import UserSubmit from "../views/user/UserSubmit.vue";

const admin = getLocalData(ADMINKEY);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home 
  },
  {
    path: "/user",
    name: "user",
    children: [
      {
        path: "booking",
        name: "UserBooking",
        component: UserSubmit,
        props: { isLoan: false}
      },
      {
        path: "loan",
        name: "UserLoan",
        component: UserSubmit,
        props: { isLoan: true}
      },
      {
        path: "login/booking",
        name: "Login booking",
        component: UserLogin,
        props: { isLoan: false}
      },
      {
        path: "login/loan",
        name: "Login loan",
        component: UserLogin,
        props: { isLoan: true}
      }
    ]
  },
  {
    path: "/loan",
    children: [
      {
        path: "",
        name: "Loan",
        component: Loan
      },
      {
        path: "item",
        name: "LoanItem",
        component: LoanItem
      },
    ]
  },
  {
    path: "/item",
    children: [
      {
        path: "",
        name: "ItemList",
        // component
      }
    ]
  },
  {
    path: "/room",
    children: [
      {
        path: "",
        name: "RoomBooking",
        component: Booking
      },
      {
        path: "request",
        name: "RoomBookingRequest",
        component: ReqBooking
      }
    ]
  },
  {
    path: "/login",
    name: "AdminLogin",
    component: Login,
  },
  {
    path: "/register",
    name: "AdminRegister",
    component: Register,
  },
];

if(admin) {
  routes.push({
    path: "/admin",
    children: [
      {
        path: "",
        name: "AdminDashboard",
        component: Dashboard,
      },
      {
        path: "add",
        name: "AdminAddItem",
        component: AddItem,
        // meta: {requiresAdmin : true}
      }
    ]
  })
}


export default routes;