import { ADMINKEY } from "../core/contants";
import { getLocalData } from "../libs/localData";
import { Role } from "../models/enums";
import AddItem from "../views/admin/AddItem.vue";
import ApproveAdmin from "../views/admin/ApproveAdmin.vue";
import Dashboard from "../views/admin/Dashboard.vue";
import Login from "../views/admin/Login.vue";
import NotApproved from "../views/admin/NotApproved.vue";
import Register from "../views/admin/Register.vue";
import Booking from "../views/booking/Booking.vue";
import ReqBooking from "../views/booking/ReqBooking.vue";
import Home from "../views/home/Home.vue";
import Item from "../views/item/Item.vue";
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
        component: Item,
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

if (admin?.data) {
  const role = admin.data.role;
  console.log("Admin role:", role);

  if (role === Role.PENDING) {
    routes.push({
      path: "/admin/not-approved",
      name: "AdminNotApproved",
      component: NotApproved,
    });
    
    routes.push({
      path: "/admin/:pathMatch(.*)*",
      name: "AdminCatchAll",
      component: NotApproved
    });
  } else {
    const adminChildren = [
      {
        path: "",
        name: "AdminDashboard",
        component: Dashboard,
      },
    ];

    if (role === Role.SUPER_ADMIN) {
      adminChildren.push({
        path: "approve",
        name: "AdminApprove",
        component: ApproveAdmin,
      });
    } 
    if (role === "admin" || role === Role.SUPER_ADMIN) {
      adminChildren.push({
        path: "add",
        name: "AdminAddItem",
        component: AddItem,
      });
    }

    routes.push({
      path: "/admin",
      children: adminChildren,
    });
  }
}

export default routes;