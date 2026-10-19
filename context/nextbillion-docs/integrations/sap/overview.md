# SAP Integration with NextBillion.ai’s Route Optimization API

## Introduction

**SAP**

SAP stands as a robust Enterprise Resource Planning (ERP) Software, offering comprehensive solutions for optimizing business operations. It covers a range of vital functions, including finance, human resources, procurement, supply chain, manufacturing, and customer relationship management. SAP extends its capabilities beyond ERP, encompassing a diverse array of business applications, analytics tools, cloud services, and more.

**NextBillion's Route Optimization API**

NextBillion's Route Optimization API is a powerful tool for businesses seeking precision and efficiency in route planning. This resourceful API aids in saving time, cutting costs, and elevating customer satisfaction. Real-time tracking and analytics are key features, empowering businesses to monitor their fleet and extract valuable insights for operational enhancement.

**Synergizing SAP with NextBillion's Route Optimization API**

By harnessing the potential of both SAP and NextBillion's Route Optimization API, businesses can bring about a transformative impact on their field operations. This collaboration enables them to stay at the forefront of today's competitive market, providing a technological edge for optimized efficiency and enhanced customer experiences.

## Prerequisites

To seamlessly integrate SAP with NextBillion.ai, ensure you have the following essentials:

**1\. SAP Account and Credentials**

Access your SAP account with the necessary login credentials.

**2\. SAP API Key**

Generate an API key from SAP to facilitate secure and authorized communication.

**3\. NextBillion.ai's API Key**

Acquire the API key from NextBillion.ai, enabling the integration process. [Contact support](mailto:support@nextbillion.ai) to get your API Key.

Ensure you have these prerequisites in place for a smooth and efficient integration between SAP and NextBillion.ai.

## SAP Integration Suite Overview

SAP facilitates seamless integration with external tools through its dedicated platform, the SAP Integration Suite, seamlessly embedded within the SAP BTP Cockpit. In this integration project, we leverage the SAP BTP Cockpit trial account. To kickstart your integration journey, sign up for a complimentary 90-day trial on the SAP BTP Cockpit via this [link](https://account.hana.ondemand.com/#/home/welcome).

### Integration Setup Steps

**1\. SAP BTP Cockpit Login**

- Click on `Go to Your Trial Account`.
- Create a Subaccount by selecting `create`.

![SAP BTP Cockpit Login](https://static.nextbillion.io/docs-next/integrations/sap/image-1.webp)

**2\. Subaccount Creation**

Navigate to the generated Subaccount and access `Instances and Subscriptions`.

![Subaccount Creation](https://static.nextbillion.io/docs-next/integrations/sap/image-2.webp)

**3\. Trial Home**

- Create the Integration Suite by choosing `create`. This action opens the `New Instance or Subscription` tab.
- Select `Integration Suite` from the Service dropdown and choose the Plan corresponding to the Subaccount.

![Trial Home](https://static.nextbillion.io/docs-next/integrations/sap/image-3.webp)

**4\. Instances and Subscription**

- The `Integration Suite` is now created.

![Instances and Subscription](https://static.nextbillion.io/docs-next/integrations/sap/image-4.webp)

**5\. Integration Suite Configuration**

- Within the integration suite, enable `Extend Non-SAP Connectivity`.
- Click on `Manage Capabilities`.

![Integration Suite Configuration](https://static.nextbillion.io/docs-next/integrations/sap/image-5.webp)

**6\. Capabilities Management**

Select `Add Capabilities`, then enable `Extend Non-SAP Connectivity`.

![Integration Suite Configuration](https://static.nextbillion.io/docs-next/integrations/sap/image-6.webp)

**7\. Activation**

With `Extend Non-SAP Connectivity` activated, integration with Non-SAP tools becomes feasible.

**8\. Connector Setup**

Click on `Discover Connectors` under the `Extend Non-SAP Connectivity` capability, opening the SAP Integration Suite connectors page.

![Connector Setup](https://static.nextbillion.io/docs-next/integrations/sap/image-7.webp)

**9\. Connector Creation**

Click on `Build New Connector`, then select `Create`'

![Connector Creation](https://static.nextbillion.io/docs-next/integrations/sap/image-8.webp)

**10\. Connector Details**

Provide connector details and click `Save & Next`.

![Connector Details](https://static.nextbillion.io/docs-next/integrations/sap/image-9.webp)

**11\. New Connector Configuration**

The created connector is displayed on the connectors page under `Private`.

![New Connector Configuration](https://static.nextbillion.io/docs-next/integrations/sap/image-10.webp)

**12\. Integration with Nextbillion's API**

For Nextbillion's API integration, set up parameters in the Setup tab:

- Base URL: `https://api.nextbillion.io`
- Select `custom` under Authentication.
- Configure API key: Name: API Key, Key: API key, Type: Text, Description: 'any description,' and check the Required button.

![Integration with Nextbillion's API](https://static.nextbillion.io/docs-next/integrations/sap/image-11.webp)

**13\. Resource Configuration**

Navigate to `Resources`, select `Blank` from `Add Resources`, name the resource, and configure parameters for a GET request to retrieve results from Nextbillion API.

![Resource Configuration](https://static.nextbillion.io/docs-next/integrations/sap/image-12.webp)

**14\. Save Changes**

Save the changes; the generated GET request template is now ready for retrieving optimization results from Nextbillion.
