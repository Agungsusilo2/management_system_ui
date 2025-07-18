import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout.jsx';
import Register from './components/user/Register.jsx';
import Login from './components/user/Login.jsx';
import DashboardLayout from './components/DashboardLayout.jsx';
import Logout from './components/user/Logout.jsx';
import { AuthProvider } from './auth/AuthContext.jsx';
import PrivateRoute from './auth/PrivateRoute.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap/dist/js/bootstrap.bundle.js"
import Profesi from "./components/profile-kelulusan/Profesi.jsx";
import ProfilKelulusan from "./components/profile-kelulusan/ProfileKelulusan.jsx";
import Aspek from "./components/cplProdi/Aspek.jsx";
import Referensi from "./components/bahanKajian/Referensi.jsx";
import BahanKajian from "./components/bahanKajian/BahaKajian.jsx";
import MataKuliah from "./components/MataKuliah.jsx";
import SubCPMK from "./components/SubCPMK.jsx";
import BKMK from "./components/BKMK.jsx";
import CPMK from "./components/CPMK.jsx";
import CPLProdi from "./components/CPLProdi.jsx";
import CPLPL from "./components/CPLPL.jsx";
import CPLBK from "./components/CPLBK.jsx";
import CPLMK from "./components/CPLMK.jsx";
import CPLBKMK from "./components/CPLBKMK.jsx";
import MKCpmkSubMK from "./components/MkCpmkSubMK.jsx";
import CplCpmkMk from "./components/CplCpmkMk.jsx";
import Home from "./components/Home.jsx";
import ProfileUser from "./components/user/ProfileUser.jsx";
import NotFound from "./components/NotFound.jsx";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<Layout />}>
                        {/*<Route path="register" element={<Register />} />*/}
                        <Route path="/" element={<Login />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>

                    <Route
                        path="dashboard"
                        element={
                            <PrivateRoute>
                                <DashboardLayout/>
                            </PrivateRoute>
                        }
                    >
                        <Route path="logout" element={<Logout />} />
                        <Route path="home" element={<Home />} />
                        <Route path="profile-user" element={<ProfileUser />} />
                        <Route path="profesi" element={<Profesi />} />
                        <Route path="profil-kelulusan" element={<ProfilKelulusan />} />
                        <Route path="aspeks" element={<Aspek />} />
                        <Route path="referensi" element={<Referensi />} />
                        <Route path="bahan-kajian" element={<BahanKajian />} />
                        <Route path="mata-kuliah" element={<MataKuliah />} />
                        <Route path="sub-cpmk" element={<SubCPMK />} />
                        <Route path="bk-mk" element={<BKMK />} />
                        <Route path="cpmk" element={<CPMK />} />
                        <Route path="cpl-prodi" element={<CPLProdi />} />
                        <Route path="cpl-pl" element={<CPLPL />} />
                        <Route path="cpl-bk" element={<CPLBK />} />
                        <Route path="cpl-mk" element={<CPLMK />} />
                        <Route path="cpl-bkmk" element={<CPLBKMK />} />
                        <Route path="mk-cpmk-sub-cpmk" element={<MKCpmkSubMK />} />
                        <Route path="cpl-cpmk-mk" element={<CplCpmkMk />} />
                    </Route>
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>
);
