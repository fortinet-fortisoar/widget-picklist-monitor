# Custom Picklist Message

Displays custom messages at the top of the detail page of records, based on the values assigned to the different states of a particular picklist. You can use this widget to highlight the state of the record and provide additional contextual information upfront to users.

An example of using the custom picklist message widget would be displaying a custom message such as `Please wait while Indicators are being extracted` when a new alert is added, i.e., the **State** of an alert record is set to **New**.

## Version Information

**Version**: 1.1.1

**Certified**: Yes

**Publisher**: Fortinet  

**Compatibility**: 7.2.0 and later  

**Applicable**: View Panel

## Release Notes

Following enhancements have been made to the custom picklist message widget in version 1.1.1:

- Handled unnecessary api calls made by the widget.

## Custom Picklist Message Views

**Custom Picklist Message Edit View**:

<img src="https://raw.githubusercontent.com/fortinet-fortisoar/widget-custom-picklist-message/release/1.1.1/docs/media/custom-picklist-msg-edit-view.png" alt="Editing the Custom Picklist Message Widget" style="border: 1px solid #A9A9A9; border-radius: 4px; padding: 10px; display: block; margin-left: auto; margin-right: auto;">

**Custom Picklist Message - Alert Detail view**:

<img src="https://raw.githubusercontent.com/fortinet-fortisoar/widget-custom-picklist-message/release/1.1.1/docs/media/detail-view-custom_msg.png" alt="Displaying a custom message on an alerts detail" style="border: 1px solid #A9A9A9; border-radius: 4px; padding: 10px; display: block; margin-left: auto; margin-right: auto;">

## Custom Picklist Message Settings

Provide the following details to customize the Custom Picklist Message widget to suit your requirements:

| Fields          | Description                              |
| --------------- | ---------------------------------------- |
| Choose Picklist | Select the picklist based on the values of whose options the custom message gets displayed at the top of the records' detail. |
| Is Set to       | Select the option of the picklist, which when set triggers the custom message to get displayed at the top of the records' detail. |
| Set Title To    | Specify the custom message to be displayed when the picklist is set to the option that users have selected. |
| Show Spinner    | Select the **Show Spinner** option if you want to display a spinner on the detail view of the record for the duration of completion of the task mentioned in the custom widget. |
| Show Icon       | Select the **Show Icon** option if you want to display an icon associated with the custom message on the detail view of the record. Once you select the **Show Icon** option, then from the icons drop-down list, you can choose the icon to be displayed with the custom message. |

