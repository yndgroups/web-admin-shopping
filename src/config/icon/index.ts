import type { App } from 'vue'
import type { AnyObj } from '@/core'
import { PlusCircleOutlined, MinusCircleOutlined, UserSwitchOutlined, CarOutlined, IdcardOutlined, SettingOutlined, UsergroupAddOutlined, WalletOutlined, AuditOutlined, AccountBookOutlined, ShopOutlined, TeamOutlined, LaptopOutlined, ClusterOutlined, CodeOutlined, CommentOutlined, ToolOutlined, DashboardOutlined, AreaChartOutlined, MinusSquareOutlined, EditOutlined, SwapRightOutlined, RightSquareFilled, AppstoreAddOutlined, PlusSquareOutlined, PlusOutlined, QuestionCircleOutlined, QuestionCircleFilled, SearchOutlined, RedoOutlined, UpOutlined, DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined, HomeOutlined, ReconciliationOutlined, HomeFilled, SignalFilled, SettingFilled, CodeSandboxCircleFilled, ReconciliationFilled, DribbbleSquareFilled, InteractionFilled, RobotFilled, StarFilled, SketchSquareFilled, FileTextFilled, ShopFilled, SendOutlined, BarsOutlined, MenuOutlined, LineOutlined, RightOutlined, NodeExpandOutlined } from '@ant-design/icons-vue'
export default (app: App<Element>) => {
  const comps: AnyObj = {}
  comps['PlusCircleOutlined'] = PlusCircleOutlined
  comps['MinusCircleOutlined'] = MinusCircleOutlined
  comps['UserSwitchOutlined'] = UserSwitchOutlined
  comps['CarOutlined'] = CarOutlined
  comps['IdcardOutlined'] = IdcardOutlined
  comps['SettingOutlined'] = SettingOutlined
  comps['UsergroupAddOutlined'] = UsergroupAddOutlined
  comps['WalletOutlined'] = WalletOutlined
  comps['AuditOutlined'] = AuditOutlined
  comps['AccountBookOutlined'] = AccountBookOutlined
  comps['ShopOutlined'] = ShopOutlined
  comps['TeamOutlined'] = TeamOutlined
  comps['LaptopOutlined'] = LaptopOutlined
  comps['ClusterOutlined'] = ClusterOutlined
  comps['CodeOutlined'] = CodeOutlined
  comps['CommentOutlined'] = CommentOutlined
  comps['ToolOutlined'] = ToolOutlined
  comps['DashboardOutlined'] = DashboardOutlined
  comps['AreaChartOutlined'] = AreaChartOutlined
  comps['PlusSquareOutlined'] = PlusSquareOutlined
  comps['MinusSquareOutlined'] = MinusSquareOutlined
  comps['PlusSquareOutlined'] = PlusSquareOutlined
  comps['EditOutlined'] = EditOutlined
  comps['SwapRightOutlined'] = SwapRightOutlined
  comps['RightSquareFilled'] = RightSquareFilled
  comps['AppstoreAddOutlined'] = AppstoreAddOutlined
  comps['PlusOutlined'] = PlusOutlined
  comps['QuestionCircleOutlined'] = QuestionCircleOutlined
  comps['QuestionCircleFilled'] = QuestionCircleFilled
  comps['SearchOutlined'] = SearchOutlined
  comps['RedoOutlined'] = RedoOutlined
  comps['UpOutlined'] = UpOutlined
  comps['DownOutlined'] = DownOutlined
  comps['HomeOutlined'] = HomeOutlined
  comps['HomeOutlined'] = HomeOutlined
  comps['HomeFilled'] = HomeFilled
  comps['SignalFilled'] = SignalFilled
  comps['SettingFilled'] = SettingFilled
  comps['ReconciliationFilled'] = ReconciliationFilled
  comps['CodeSandboxCircleFilled'] = CodeSandboxCircleFilled
  comps['ReconciliationOutlined'] = ReconciliationOutlined
  comps['DribbbleSquareFilled'] = DribbbleSquareFilled
  comps['InteractionFilled'] = InteractionFilled
  comps['RobotFilled'] = RobotFilled
  comps['StarFilled'] = StarFilled
  comps['SketchSquareFilled'] = SketchSquareFilled
  comps['FileTextFilled'] = FileTextFilled
  comps['ShopFilled'] = ShopFilled
  comps['SendOutlined'] = SendOutlined
  comps['BarsOutlined'] = BarsOutlined
  comps['MenuOutlined'] = MenuOutlined
  comps['LineOutlined'] = LineOutlined
  comps['RightOutlined'] = RightOutlined
  comps['NodeExpandOutlined'] = NodeExpandOutlined
  comps['MenuFoldOutlined'] = MenuFoldOutlined
  comps['MenuUnFoldOutlined'] = MenuUnfoldOutlined
  for (const k in comps) {
    app.component(k, comps[k])
  }

  const icons = Object.keys(comps)
  app.provide('icons', icons)
  return app
}
