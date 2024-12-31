# Connecting to the target site where the component will be added
Connect-PnPOnline -Url '<SPO-SITE-URL>' -Interactive -ClientId '<YOUR-CLIENT-ID>'

# Getting the list default Content Type (but could also be a Hub or a Document Set one)
$listCT = Get-PnPContentType -Identity "Item" -List "/Lists/CustomForm"

# Form customizer component id, find it in serve.json
$customFormComponentId = '<FORM-CUSTOMIZER-COMPONENT-ID>'

# Reset to default form
# $listCT.DisplayFormClientSideComponentId = $null
# $listCT.EditFormClientSideComponentId = $null
# $listCT.NewFormClientSideComponentId = $null

# Linking the component to the different form contexts
$listCT.DisplayFormClientSideComponentId = $customFormComponentId
$listCT.EditFormClientSideComponentId = $customFormComponentId
$listCT.NewFormClientSideComponentId = $customFormComponentId
$listCT.Update(0)

Invoke-PnPQuery
