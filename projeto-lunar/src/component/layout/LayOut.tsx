import { Outlet } from "react-router-dom"
import HeaderLunar from "../header/header"

const LayOut = () => {
  return (
    <div>
      <Outlet />
      <HeaderLunar />
    </div>
  )
}

export default LayOut