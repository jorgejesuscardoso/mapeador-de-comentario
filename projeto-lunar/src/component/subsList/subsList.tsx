/* eslint-disable @typescript-eslint/no-explicit-any */
import { Select } from "../../pages/dashboard/style";

const Sublist = ({setSub, sub}: any) => {
    return (
        <Select
            value={sub}
            onChange={(e) => setSub(e.target.value)}
        >  
            <option value="Select">Selecione</option>
            <option value="Sem Sub">Sem sub</option>
            <option value="Luna A-1">Luna A-1</option>
            <option value="Luna A-2">Luna A-2</option>
            <option value="Luna A-3">Luna A-3</option>
            <option value="Luna A-4">Luna A-4</option>
            <option value="Luna A-5">Luna A-5</option>
            <option value="Luna A-6">Luna A-6</option>
            <option value="Luna A-7">Luna A-7</option>
            <option value="Luna A-8">Luna A-8</option>
            <option value="Luna A-9">Luna A-9</option>
            <option value="Luna A-10">Luna A-10</option>
            <option value="Luna A-11">Luna A-11</option>
            <option value="Luna A-12">Luna A-12</option>
            <option value="Luna A-13">Luna A-13</option>
            <option value="Luna A-14">Luna A-14</option>
            <option value="Luna A-15">Luna A-15</option>
        </Select>
    );
}

export default Sublist;