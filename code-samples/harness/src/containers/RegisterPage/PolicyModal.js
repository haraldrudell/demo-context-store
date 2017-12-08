import React from 'react'
import { Modal } from 'react-bootstrap'
import { WingsModal } from 'components'
import css from './PolicyModal.css'

export default class PolicyModal extends React.Component {
  render () {
    return (
      <WingsModal show={this.props.show} onHide={this.props.onHide} className={css.main}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>Terms of Service</h1>
            <p className={css.content}>Effective May 1, 2017</p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={css.policyContent}>
            <section>
              <header>
                <h2>1. SAAS SERVICES AND SUPPORT</h2>
              </header>
              <div className={css.content}>
                <p>
                  1.1 Subject to the terms of this Agreement, Harness Inc will use commercially reasonable efforts to
                  provide Customer the Services. As part of the registration process, Customer will identify an
                  administrative user name and password for Customer’s Harness Inc account. Harness Inc reserves the
                  right to refuse registration of, or cancel passwords it deems inappropriate.
                </p>
                <p>
                  1.2 Subject to the terms hereof, Harness Inc will endeavor to provide Customer with reasonable support
                  services, through electronic mail or another online mechanism, in accordance with Harness Inc’s
                  standard practice.
                </p>
              </div>
            </section>
            <section>
              <header>
                <h2>2. RESTRICTIONS AND RESPONSIBILITIES</h2>
              </header>
              <div className={css.content}>
                <p>
                  2.1 This is a contract for Services and any software that is provided (regardless of the premises
                  location) will be installed, accessed and maintained only by or for Harness Inc and no license is
                  granted thereto. Customer will not, directly or indirectly: reverse engineer, decompile, disassemble
                  or otherwise attempt to discover the source code, object code or underlying structure, ideas, know-how
                  or algorithms relevant to the Services or any software, documentation or data related to the Services
                  (“Software”); modify, translate, or create derivative works based on the Services or any Software
                  (except to the extent expressly permitted by Harness Inc or authorized within the Services); use the
                  Services or any Software for timesharing or service bureau purposes or otherwise for the benefit of a
                  third ; or remove any proprietary notices or labels.
                </p>

                <p>
                  2.2 Customer represents, covenants, and warrants that Customer will use the Services only in
                  compliance with Harness Inc’s standard published policies then in effect (the “Policy”) and all
                  applicable laws and regulations. Customer hereby agrees to indemnify and hold harmless Harness Inc
                  against any damages, losses, liabilities, settlements and expenses (including without limitation costs
                  and attorneys’ fees) in connection with any claim or action that arises from an alleged violation of
                  the foregoing or otherwise from Customer’s use of Services. Although Harness Inc has no obligation to
                  monitor Customer’s use of the Services, Harness Inc may do so and may prohibit any use of the Services
                  it believes may be (or alleged to be) in violation of the foregoing.
                </p>

                <p>
                  2.3 Customer shall be responsible for obtaining and maintaining any equipment and ancillary services
                  needed to connect to, access or otherwise use the Services, including, without limitation, modems,
                  hardware, server, software, operating system, networking, web servers, long distance and local
                  telephone service (collectively, “Equipment”). Customer shall also be responsible for maintaining the
                  security of the Equipment, Customer account, passwords (including but not limited to administrative
                  and user passwords) and files, and for all uses of Customer account or the Equipment with or without
                  Customer’s knowledge or consent.
                </p>
              </div>
            </section>
            <section>
              <header>
                <h2>3. CONFIDENTIALITY; PROPRIETARY RIGHTS</h2>
              </header>
              <div className={css.content}>
                <p>
                  3.1 Each party (the “Receiving Party”) understands that the other party (the “Disclosing Party”) has
                  disclosed or may disclose business, technical or financial information relating to the Disclosing
                  Party’s business (hereinafter referred to as “Proprietary Information” of the Disclosing Party).
                  Proprietary Information of Harness Inc includes non-public information regarding features,
                  functionality and performance of the Service. Proprietary Information of Customer includes non-public
                  data provided by Customer to Harness Inc to enable the provision of the Services (“Customer Data”).
                  The Receiving Party agrees: (i) to take reasonable precautions to protect such Proprietary
                  Information, and (ii) not to use (except in performance of the Services or as otherwise permitted
                  herein) or divulge to any third person any such Proprietary Information. The Disclosing Party agrees
                  that the foregoing shall not apply with respect to any information after five (5) years following the
                  disclosure thereof or any information that the Receiving Party can document (a) is or becomes
                  generally available to the public, or (b) was in its possession or known by it prior to receipt from
                  the Disclosing Party, or (c) was rightfully disclosed to it without restriction by a third party, or
                  (d) was independently developed without use of any Proprietary Information of the Disclosing Party or
                  (e) is required to be disclosed by law.
                </p>

                <p>
                  3.2 Customer shall own all right, title and interest in and to the Customer Data, as well as any data
                  that is based on or derived from the Customer Data and provided to Customer as part of the Services.
                  Harness Inc shall own and retain all right, title and interest in and to (a) the Services and
                  Software, all improvements, enhancements or modifications thereto, (b) any software, applications,
                  inventions or other technology developed in connection with Professional Services or support, and (c)
                  all intellectual property rights related to any of the foregoing.
                </p>

                <p>
                  3.3 Notwithstanding anything to the contrary, Harness Inc shall have the right collect and analyze
                  data and other information relating to the provision, use and performance of various spects of the
                  Services and related systems and technologies (including, without limitation, information concerning
                  Customer Data and data derived therefrom), and Harness Inc will be free (during and after the term
                  hereof) to (i) use such information and data to improve and enhance the Services and for other
                  development, diagnostic and corrective purposes in connection with the Services and other Harness Inc
                  offerings, and (ii) disclose such data solely in aggregate or other de-identified form in connection
                  with its business. No rights or licenses are granted except as expressly set forth herein.
                </p>
              </div>
            </section>
            <section>
              <header>
                <h2>4. PAYMENT OF FEES</h2>
              </header>
              <div className={css.content}>
                <p>
                  4.1 Customer will pay Harness Inc the then applicable fees described in the Order Form for the
                  Services and Professional Services in accordance with the terms therein (the “Fees”). Harness Inc
                  reserves the right to change the Fees or applicable charges and to institute new charges and Fees at
                  the end of the Initial Service Term or then current renewal term, upon thirty (30) days prior notice
                  to Customer (which may be sent by email). If Customer believes that Harness Inc has billed Customer
                  incorrectly, Customer must contact Harness Inc no later than 60 days after the closing date on the
                  first billing statement in which the error or problem appeared, in order to receive an adjustment or
                  credit. Inquiries should be directed to Harness Inc’s customer support department.
                </p>

                <p>
                  4.2 Harness Inc may choose to bill through an invoice, in which case, full payment for invoices issued
                  in any given month must be received by Harness Inc thirty (30) days after the mailing date of the
                  invoice. Unpaid amounts are subject to a finance charge of 1.5% per month on any outstanding balance,
                  or the maximum permitted by law, whichever is lower, plus all expenses of collection and may result in
                  immediate termination of Service. Customer shall be responsible for all taxes associated with Services
                  other than U.S. taxes based on Harness Inc’s net income.
                </p>
              </div>
            </section>

            <section>
              <header>
                <h2>5. TERMINATION</h2>
              </header>
              <div className={css.content}>
                <p>
                  5.1 Subject to earlier termination as provided below, this Agreement is for the Initial Service Term
                  as specified in the Order Form, and shall be automatically renewed for additional periods of the same
                  duration as the Initial Service Term (collectively, the “Term”), unless either party requests
                  termination at least thirty (30) days prior to the end of the then-current term.
                </p>

                <p>
                  5.2 In addition to any other remedies it may have, either party may also terminate this Agreement upon
                  thirty (30) days’ notice (or without notice in the case of nonpayment), if the other party materially
                  breaches any of the terms or conditions of this Agreement. Customer will pay in full for the Services
                  up to and including the last day on which the Services are provided. Upon any termination, Harness Inc
                  will make all Customer Data available to Customer for retrieval for a period of thirty (30) days, but
                  thereafter Harness Inc may, but is not obligated to, delete stored Customer Data. All sections of this
                  Agreement which by their nature should survive termination will survive termination, including,
                  without limitation, accrued rights to payment, confidentiality obligations, warranty disclaimers, and
                  limitations of liability.
                </p>
              </div>
            </section>
            <section>
              <header>
                <h2>6. WARRANTY AND DISCLAIMER</h2>
              </header>
              <div className={css.content}>
                <p>
                  Harness Inc shall use reasonable efforts consistent with prevailing industry standards to maintain the
                  Services in a manner which minimizes errors and interruptions in the Services and shall perform the
                  Professional Services in a professional and workmanlike manner. Services may be temporarily
                  unavailable for scheduled maintenance or for unscheduled emergency maintenance, either by Harness Inc
                  or by third-party providers, or because of other causes beyond Harness Inc’s reasonable control, but
                  Harness Inc shall use reasonable efforts to provide advance notice in writing or by e-mail of any
                  scheduled service disruption. HOWEVER, HARNESS INC DOES NOT WARRANT THAT THE SERVICES WILL BE
                  UNINTERRUPTED OR ERROR FREE; NOR DOES IT MAKE ANY WARRANTY AS TO THE RESULTS THAT MAY BE OBTAINED FROM
                  USE OF THE SERVICES. EXCEPT AS EXPRESSLY SET FORTH IN THIS SECTION, THE SERVICES AND PROFESSIONAL
                  SERVICES ARE PROVIDED “AS IS” AND HARNESS INC DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING,
                  BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE AND
                  NONINFRINGEMENT.
                </p>
              </div>
            </section>
            <section>
              <header>
                <h2>7. LIMITATION OF LIABILITY</h2>
              </header>
              <div className={css.content}>
                NOTWITHSTANDING ANYTHING TO THE CONTRARY, EXCEPT FOR BODILY INJURY OF A PERSON, HARNESS INC AND ITS
                SUPPLIERS (INCLUDING BUT NOT LIMITED TO ALL EQUIPMENT AND TECHNOLOGY SUPPLIERS), OFFICERS, AFFILIATES,
                REPRESENTATIVES, CONTRACTORS AND EMPLOYEES SHALL NOT BE RESPONSIBLE OR LIABLE WITH RESPECT TO ANY
                SUBJECT MATTER OF THIS AGREEMENT OR TERMS AND CONDITIONS RELATED THERETO UNDER ANY CONTRACT, NEGLIGENCE,
                STRICT LIABILITY OR OTHER THEORY: (A) FOR ERROR OR INTERRUPTION OF USE OR FOR LOSS OR INACCURACY OR
                CORRUPTION OF DATA OR COST OF PROCUREMENT OF SUBSTITUTE GOODS, SERVICES OR TECHNOLOGY OR LOSS OF
                BUSINESS; (B) FOR ANY INDIRECT, EXEMPLARY, INCIDENTAL, SPECIAL OR CONSEQUENTIAL DAMAGES; (C) FOR ANY
                MATTER BEYOND HARNESS INC’S REASONABLE CONTROL; OR (D) FOR ANY AMOUNTS THAT, TOGETHER WITH AMOUNTS
                ASSOCIATED WITH ALL OTHER CLAIMS, EXCEED THE FEES PAID BY CUSTOMER TO HARNESS INC FOR THE SERVICES UNDER
                THIS AGREEMENT IN THE 12 MONTHS PRIOR TO THE ACT THAT GAVE RISE TO THE LIABILITY, IN EACH CASE, WHETHER
                OR NOT HARNESS INC HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              </div>
            </section>
            <section>
              <header>
                <h2>8. GOVERNMENT MATTERS</h2>
              </header>
              <div className={css.content}>
                <p>
                  {' '}Customer may not remove or export from the United States or allow the export or re-export of the
                  Services, Software or anything related thereto, or any direct product thereof in violation of any
                  restrictions, laws or regulations of the United States Department of Commerce, the United States
                  Department of Treasury Office of Foreign Assets Control, or any other United States or foreign agency
                  or authority. As defined in FAR section 2.101, the Software and documentation are “commercial items”
                  and according to DFAR section 252.227 7014(a)(1) and (5) are deemed to be “commercial computer
                  software” “commercial computer software documentation.” Consistent with DFAR section 227.7202 and FAR
                  section 12.212, any use modification, reproduction, release, performance, display, or disclosure of
                  such commercial software or commercial software documentation by the U.S. Government will be governed
                  solely by the terms of this Agreement and will be prohibited except to the extent expressly permitted
                  by the terms of this Agreement.
                </p>
              </div>
            </section>
            <section>
              <header>
                <h2>9. MISCELLANEOUS</h2>
              </header>
              <div className={css.content}>
                <p>
                  If any provision of this Agreement is found to be unenforceable or invalid, that provision will be
                  limited or eliminated to the minimum extent necessary so that this Agreement will otherwise remain in
                  full force and effect and enforceable. This Agreement is not assignable, transferable or sublicensable
                  by Customer except with Harness Inc’s prior written consent. Harness Inc may transfer and assign any
                  of its rights and obligations under this Agreement without consent. This Agreement is the complete and
                  exclusive statement of the mutual understanding of the parties and supersedes and cancels all previous
                  written and oral agreements, communications and other understandings relating to the subject matter of
                  this Agreement, and that all waivers and modifications must be in a writing signed by both parties,
                  except as otherwise provided herein. No agency, partnership, joint venture, or employment is created
                  as a result of this Agreement and Customer does not have any authority of any kind to bind Harness Inc
                  in any respect whatsoever. In any action or proceeding to enforce rights under this Agreement, the
                  prevailing party will be entitled to recover costs and attorneys’ fees. All notices under this
                  Agreement will be in writing and will be deemed to have been duly given when received, if personally
                  delivered; when receipt is electronically confirmed, if transmitted by facsimile or e-mail; the day
                  after it is sent, if sent for next day delivery by recognized overnight delivery service; and upon
                  receipt, if sent by certified or registered mail, return receipt requested. This Agreement shall be
                  governed by the laws of the State of California without regard to its conflict of laws provisions.
                </p>
              </div>
            </section>
          </div>
        </Modal.Body>
      </WingsModal>
    )
  }
}



// WEBPACK FOOTER //
// ../src/containers/RegisterPage/PolicyModal.js