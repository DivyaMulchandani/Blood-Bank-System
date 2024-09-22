import React from "react";
import Layout from "../../components/shared/Layout/Layout";
import { useSelector } from "react-redux";
const AdminHome = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <Layout>
      <div className="container">
        <div className="d-felx flex-column mt-4">
          <h1>
            Welcome Admin <i className="text-success">{user?.name}</i>
          </h1>
          <h3>Manage Blood Bank App </h3>
          <hr />
          <p>
            Our Blood Bank Management System is dedicated to providing seamless
            management and oversight of blood donations and inventory. As an
            admin, you play a vital role in ensuring the smooth functioning of
            the blood bank, keeping track of critical inventory, and
            facilitating life-saving donations. This dashboard provides you with
            easy access to: - Donor Lists: Manage and track registered blood
            donors and their donation history. - Hospital Lists: Coordinate with
            hospitals to ensure blood supplies are available when needed. -
            Organization Lists: Collaborate with partner organizations and
            manage their contributions to the blood bank. Our system is designed
            with the following goals in mind: 1. Efficiency: Real-time tracking
            of blood inventory and streamlined donor management processes. 2.
            Transparency: Clear, accessible data on blood levels, donations, and
            hospital requests. 3. Security: Safeguarding sensitive information
            about donors and hospitals with the latest data security standards.
            Together, we can make sure that no one in need of blood ever has to
            wait. Thank you for your crucial role in managing and overseeing
            this lifesaving system.
          </p>
        </div>
      </div>
    </Layout>
  );
};
export default AdminHome;
