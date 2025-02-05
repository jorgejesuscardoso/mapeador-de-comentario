import { Outlet } from "react-router-dom"
import HeaderLunar from "../header/header"
import { LayOutContainer } from "./style"

const LayOut = () => {
  return (
    <LayOutContainer>
      <Outlet />
      <HeaderLunar />
    </LayOutContainer>
  )
}

export default LayOut