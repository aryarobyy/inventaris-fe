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
import Maintanance from "../views/unknownHandler/Maintanance.vue";
import UnknownPage from "../views/unknownHandler/UnknownPage.vue";
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
    path: "/maintanance",
    name: "Maintanance",
    component: Maintanance 
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
        component: LoanItem,
        props: { admin: admin}
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
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: UnknownPage
  }
];

if (admin) {
  const role = admin.role;
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
        props: { admin: admin }
      },
    ];

    if (role === Role.SUPER_ADMIN) {
      adminChildren.push({
        path: "approve",
        name: "AdminApprove",
        component: ApproveAdmin,
        props: { admin: admin }
      });
    } 
    if (role === "admin" || role === Role.SUPER_ADMIN) {
      adminChildren.push({
        path: "add",
        name: "AdminAddItem",
        component: AddItem,
        props: { admin: admin }
      });
    }

    routes.push({
      path: "/admin",
      name: "Admin",
      children: adminChildren,
    });
  }
}

export default routes;