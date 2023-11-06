import { Achievement } from "../../typedefs/firebaseTypedefs";


export interface Props{
    onChange: (achievements : Achievement[]) => void
}